
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ResourceGrid from '@/components/ResourceGrid';
import UploadZone from '@/components/UploadZone';

// Demo data - in a real app, this would come from your cloud storage API
const demoResources = [
  {
    id: '1',
    name: 'Summer Vacation 2024.jpg',
    type: 'image' as const,
    size: '2.4 MB',
    date: '2024-06-10',
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop',
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Family Dinner.mp4',
    type: 'video' as const,
    size: '15.7 MB',
    date: '2024-06-08',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Beach Sunset.jpg',
    type: 'image' as const,
    size: '3.1 MB',
    date: '2024-06-05',
    thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop',
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Mountain Hike.jpg',
    type: 'image' as const,
    size: '4.2 MB',
    date: '2024-06-03',
    thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop',
    isFavorite: true,
  },
  {
    id: '5',
    name: 'City Lights.jpg',
    type: 'image' as const,
    size: '2.8 MB',
    date: '2024-06-01',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    isFavorite: false,
  },
  {
    id: '6',
    name: 'Coffee Shop.jpg',
    type: 'image' as const,
    size: '1.9 MB',
    date: '2024-05-28',
    thumbnail: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop',
    isFavorite: false,
  },
];

const Index = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filteredResources = demoResources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === 'all' ||
      (selectedCategory === 'photos' && resource.type === 'image') ||
      (selectedCategory === 'videos' && resource.type === 'video') ||
      (selectedCategory === 'favorites' && resource.isFavorite) ||
      selectedCategory === 'recent'; // For demo, showing all as recent
    
    return matchesSearch && matchesCategory;
  });

  const handleResourceClick = (resource: any) => {
    console.log('Opening resource:', resource.name);
    // In a real app, this would open a preview modal or download the file
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onUploadClick={() => setIsUploadOpen(true)}
          />
          
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedCategory === 'all' && 'All Files'}
                  {selectedCategory === 'photos' && 'Photos'}
                  {selectedCategory === 'videos' && 'Videos'}
                  {selectedCategory === 'favorites' && 'Favorites'}
                  {selectedCategory === 'recent' && 'Recent'}
                  {selectedCategory === 'trash' && 'Trash'}
                </h2>
                <p className="text-gray-600">
                  {filteredResources.length} {filteredResources.length === 1 ? 'item' : 'items'}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>

              {filteredResources.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No files found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? 'Try adjusting your search terms' : 'Upload your first files to get started'}
                  </p>
                </div>
              ) : (
                <ResourceGrid
                  resources={filteredResources}
                  viewMode={viewMode}
                  onResourceClick={handleResourceClick}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      <UploadZone
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
};

export default Index;
