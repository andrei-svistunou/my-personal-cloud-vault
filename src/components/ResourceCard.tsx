
import React from 'react';
import { Star, Play } from 'lucide-react';
import ResourceActions from './ResourceActions';

interface Resource {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  date: string;
  thumbnail: string;
  isFavorite: boolean;
}

interface ResourceCardProps {
  resource: Resource;
  onResourceClick: (resource: Resource) => void;
  onPreview: (resource: Resource, e?: React.MouseEvent) => void;
  onToggleFavorite: (resourceId: string) => void;
  onDelete: (resourceId: string) => void;
  onRestore?: (resourceId: string) => void;
  onAssignToFolder?: (resource: Resource, e?: React.MouseEvent) => void;
  formatFileSize: (size: string) => string;
  formatDate: (date: string) => string;
  isTrashView?: boolean;
}

const ResourceCard = ({
  resource,
  onResourceClick,
  onPreview,
  onToggleFavorite,
  onDelete,
  onRestore,
  onAssignToFolder,
  formatFileSize,
  formatDate,
  isTrashView = false,
}: ResourceCardProps) => {
  return (
    <div
      className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={() => onResourceClick(resource)}
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        {resource.type === 'video' ? (
          <>
            <video
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              preload="metadata"
              muted
            >
              <source src={resource.thumbnail + '#t=1'} type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <Play className="h-8 w-8 text-white opacity-80" fill="currentColor" />
            </div>
          </>
        ) : (
          <img
            src={resource.thumbnail}
            alt={resource.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
          {resource.name}
        </h3>
        <p className="text-xs text-gray-500">
          {formatFileSize(resource.size)} • {formatDate(resource.date)}
        </p>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ResourceActions
          resource={resource}
          onPreview={onPreview}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
          onRestore={onRestore}
          onAssignToFolder={onAssignToFolder}
          variant="grid"
          isTrashView={isTrashView}
        />
      </div>

      {!isTrashView && resource.isFavorite && (
        <div className="absolute top-2 left-2">
          <Star className="h-4 w-4 text-yellow-400 fill-current drop-shadow-sm" />
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
