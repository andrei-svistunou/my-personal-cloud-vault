
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useResources } from '@/hooks/useResources';
import { useUpload } from '@/hooks/useUpload';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ResourceGrid from '@/components/ResourceGrid';
import UploadZone from '@/components/UploadZone';
import Auth from '@/components/Auth';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Extract folder ID from selectedCategory if it's a folder
  const currentFolderId = selectedCategory.startsWith('folder:') 
    ? selectedCategory.replace('folder:', '') 
    : undefined;
  
  const { resources, loading, refetch, toggleFavorite, deleteResource } = useResources(currentFolderId);
  const { uploadFiles } = useUpload();

  // Show auth page if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = false;
    
    if (selectedCategory === 'all') {
      matchesCategory = true;
    } else if (selectedCategory === 'photos') {
      matchesCategory = resource.file_type === 'image';
    } else if (selectedCategory === 'videos') {
      matchesCategory = resource.file_type === 'video';
    } else if (selectedCategory === 'favorites') {
      matchesCategory = resource.is_favorite;
    } else if (selectedCategory === 'recent') {
      matchesCategory = true; // For now, showing all as recent
    } else if (selectedCategory.startsWith('folder:')) {
      // When a folder is selected, we already filtered by folder in useResources
      matchesCategory = true;
    }
    
    return matchesSearch && matchesCategory;
  });

  // Transform resources to match ResourceGrid expected format with proper type mapping and image URLs
  const transformedResources = filteredResources.map(resource => {
    let thumbnailUrl = '';
    
    // Generate the public URL for the image from Supabase Storage
    if (resource.storage_path) {
      const { data } = supabase.storage
        .from('resources')
        .getPublicUrl(resource.storage_path);
      thumbnailUrl = data.publicUrl;
    }

    return {
      id: resource.id,
      name: resource.name,
      type: resource.file_type as 'image' | 'video' | 'document',
      size: `${(resource.file_size / 1024 / 1024).toFixed(2)} MB`, // Convert to string with MB format
      date: resource.created_at,
      thumbnail: thumbnailUrl,
      isFavorite: resource.is_favorite,
      storage_path: resource.storage_path,
      original_name: resource.original_name,
      mime_type: resource.mime_type,
      folder_id: resource.folder_id,
      is_deleted: resource.is_deleted,
      created_at: resource.created_at,
      updated_at: resource.updated_at,
      user_id: resource.user_id
    };
  });

  const handleResourceClick = (resource: any) => {
    console.log('Opening resource:', resource.name);
    // Preview functionality will be implemented
  };

  const handleUpload = async (files: File[]) => {
    console.log('Upload started with files:', files.length);
    await uploadFiles(files);
    setIsUploadOpen(false);
    refetch();
  };

  const handleToggleFavorite = async (resourceId: string) => {
    await toggleFavorite(resourceId);
    // The toggleFavorite function in useResources hook already updates the local state
    // so the UI will update immediately
  };

  const handleDeleteResource = async (resourceId: string) => {
    await deleteResource(resourceId);
    // The deleteResource function in useResources hook already updates the local state
    // so the UI will update immediately
  };

  const getCategoryTitle = () => {
    if (selectedCategory === 'all') return 'All Files';
    if (selectedCategory === 'photos') return 'Photos';
    if (selectedCategory === 'videos') return 'Videos';
    if (selectedCategory === 'favorites') return 'Favorites';
    if (selectedCategory === 'recent') return 'Recent';
    if (selectedCategory === 'trash') return 'Trash';
    if (selectedCategory.startsWith('folder:')) {
      // For folder titles, we would need to look up the folder name
      return 'Folder';
    }
    return 'Files';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          resourceCounts={{
            all: resources.length,
            photos: resources.filter(r => r.file_type === 'image').length,
            videos: resources.filter(r => r.file_type === 'video').length,
            favorites: resources.filter(r => r.is_favorite).length,
            recent: resources.length,
            trash: 0, // We'll implement trash later
          }}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onUploadClick={() => {
              console.log('Upload button clicked');
              setIsUploadOpen(true);
            }}
          />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {getCategoryTitle()}
                </h2>
                <p className="text-gray-600">
                  {loading ? 'Loading...' : `${filteredResources.length} ${filteredResources.length === 1 ? 'item' : 'items'}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>Loading your files...</p>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No files found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? 'Try adjusting your search terms' : selectedCategory.startsWith('folder:') ? 'No files in this folder yet' : 'Upload your first files to get started'}
                  </p>
                </div>
              ) : (
                <ResourceGrid
                  resources={transformedResources}
                  viewMode={viewMode}
                  onResourceClick={handleResourceClick}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDeleteResource}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      <UploadZone
        isOpen={isUploadOpen}
        onClose={() => {
          console.log('Upload modal closed');
          setIsUploadOpen(false);
        }}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default Index;
