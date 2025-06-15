
import React, { useState } from 'react';
import PreviewModal from './PreviewModal';
import ResourceCard from './ResourceCard';
import ResourceListItem from './ResourceListItem';

interface Resource {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  date: string;
  thumbnail: string;
  isFavorite: boolean;
  storage_path?: string;
}

interface ResourceGridProps {
  resources: Resource[];
  viewMode: 'grid' | 'list';
  onResourceClick: (resource: Resource) => void;
  onToggleFavorite: (resourceId: string) => void;
  onDelete: (resourceId: string) => void;
}

const ResourceGrid = ({ resources, viewMode, onResourceClick, onToggleFavorite, onDelete }: ResourceGridProps) => {
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const formatFileSize = (size: string) => size;
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  const handlePreview = (resource: Resource, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setPreviewResource(resource);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewResource(null);
  };

  const handleResourceClick = (resource: Resource) => {
    // Open preview for images and videos, use original handler for other types
    if (resource.type === 'image' || resource.type === 'video') {
      handlePreview(resource);
    } else {
      onResourceClick(resource);
    }
  };

  const handleToggleFavorite = (resourceId: string) => {
    onToggleFavorite(resourceId);
  };

  const handleDelete = (resourceId: string) => {
    onDelete(resourceId);
  };

  if (viewMode === 'list') {
    return (
      <>
        <div className="space-y-2">
          {resources.map((resource) => (
            <ResourceListItem
              key={resource.id}
              resource={resource}
              onResourceClick={handleResourceClick}
              onPreview={handlePreview}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
              formatFileSize={formatFileSize}
              formatDate={formatDate}
            />
          ))}
        </div>

        <PreviewModal
          resource={previewResource}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onResourceClick={handleResourceClick}
            onPreview={handlePreview}
            onToggleFavorite={handleToggleFavorite}
            onDelete={handleDelete}
            formatFileSize={formatFileSize}
            formatDate={formatDate}
          />
        ))}
      </div>

      <PreviewModal
        resource={previewResource}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDelete}
      />
    </>
  );
};

export default ResourceGrid;
