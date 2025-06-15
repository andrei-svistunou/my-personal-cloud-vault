
import React, { useState } from 'react';
import { Grid3X3, List } from 'lucide-react';
import ResourceCard from './ResourceCard';
import ResourceListItem from './ResourceListItem';
import ResourceFolderDialog from './ResourceFolderDialog';
import { useFolders } from '@/hooks/useFolders';
import { supabase } from '@/integrations/supabase/client';

interface Resource {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  date: string;
  thumbnail: string;
  isFavorite: boolean;
  storage_path?: string;
  original_name?: string;
  mime_type?: string;
  folder_id?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

interface ResourceGridProps {
  resources: Resource[];
  viewMode: 'grid' | 'list';
  onResourceClick: (resource: Resource) => void;
  onToggleFavorite: (resourceId: string) => void;
  onDelete: (resourceId: string) => void;
  onRestore?: (resourceId: string) => void;
  isTrashView?: boolean;
}

const ResourceGrid = ({
  resources,
  viewMode,
  onResourceClick,
  onToggleFavorite,
  onDelete,
  onRestore,
  isTrashView = false,
}: ResourceGridProps) => {
  const [selectedResourceForFolder, setSelectedResourceForFolder] = useState<Resource | null>(null);
  const [assignedFolderIds, setAssignedFolderIds] = useState<string[]>([]);
  const { folders, assignResourceToFolder, removeResourceFromFolder } = useFolders();

  const formatFileSize = (size: string) => {
    return size;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const handlePreview = (resource: Resource, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    console.log('Preview resource:', resource);
    // Preview functionality will be implemented later
  };

  const handleAssignToFolder = async (resource: Resource, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    // Fetch current folder assignments for this resource
    try {
      const { data: currentAssignments, error } = await supabase
        .from('resource_folders')
        .select('folder_id')
        .eq('resource_id', resource.id);

      if (error) {
        console.error('Error fetching folder assignments:', error);
        return;
      }

      const currentFolderIds = currentAssignments?.map(a => a.folder_id) || [];
      setAssignedFolderIds(currentFolderIds);
      setSelectedResourceForFolder(resource);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAssignResourceToFolder = async (resourceId: string, folderId: string) => {
    await assignResourceToFolder(resourceId, folderId);
    // Update local state to reflect the change
    setAssignedFolderIds(prev => [...prev, folderId]);
  };

  const handleRemoveResourceFromFolder = async (resourceId: string, folderId: string) => {
    await removeResourceFromFolder(resourceId, folderId);
    // Update local state to reflect the change
    setAssignedFolderIds(prev => prev.filter(id => id !== folderId));
  };

  if (viewMode === 'grid') {
    return (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onResourceClick={onResourceClick}
              onPreview={handlePreview}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDelete}
              onRestore={onRestore}
              onAssignToFolder={handleAssignToFolder}
              formatFileSize={formatFileSize}
              formatDate={formatDate}
              isTrashView={isTrashView}
            />
          ))}
        </div>

        {selectedResourceForFolder && (
          <ResourceFolderDialog
            isOpen={!!selectedResourceForFolder}
            onClose={() => {
              setSelectedResourceForFolder(null);
              setAssignedFolderIds([]);
            }}
            resourceId={selectedResourceForFolder.id}
            resourceName={selectedResourceForFolder.name}
            folders={folders}
            onAssignToFolder={handleAssignResourceToFolder}
            onRemoveFromFolder={handleRemoveResourceFromFolder}
            assignedFolderIds={assignedFolderIds}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {resources.map((resource) => (
          <ResourceListItem
            key={resource.id}
            resource={resource}
            onResourceClick={onResourceClick}
            onPreview={handlePreview}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
            onRestore={onRestore}
            onAssignToFolder={handleAssignToFolder}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
            isTrashView={isTrashView}
          />
        ))}
      </div>

      {selectedResourceForFolder && (
        <ResourceFolderDialog
          isOpen={!!selectedResourceForFolder}
          onClose={() => {
            setSelectedResourceForFolder(null);
            setAssignedFolderIds([]);
          }}
          resourceId={selectedResourceForFolder.id}
          resourceName={selectedResourceForFolder.name}
          folders={folders}
          onAssignToFolder={handleAssignResourceToFolder}
          onRemoveFromFolder={handleRemoveResourceFromFolder}
          assignedFolderIds={assignedFolderIds}
        />
      )}
    </>
  );
};

export default ResourceGrid;
