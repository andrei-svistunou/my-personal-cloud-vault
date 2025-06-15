
import React from 'react';
import { Star } from 'lucide-react';
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

interface ResourceListItemProps {
  resource: Resource;
  onResourceClick: (resource: Resource) => void;
  onPreview: (resource: Resource, e?: React.MouseEvent) => void;
  onToggleFavorite: (resourceId: string, e: React.MouseEvent) => void;
  onDelete: (resourceId: string, e: React.MouseEvent) => void;
  formatFileSize: (size: string) => string;
  formatDate: (date: string) => string;
}

const ResourceListItem = ({
  resource,
  onResourceClick,
  onPreview,
  onToggleFavorite,
  onDelete,
  formatFileSize,
  formatDate,
}: ResourceListItemProps) => {
  return (
    <div
      className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => onResourceClick(resource)}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={resource.thumbnail}
          alt={resource.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 ml-4 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {resource.name}
        </h3>
        <p className="text-sm text-gray-500">
          {formatFileSize(resource.size)} • {formatDate(resource.date)}
        </p>
      </div>

      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {resource.isFavorite && (
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
        )}
        
        <ResourceActions
          resource={resource}
          onPreview={onPreview}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
          variant="list"
        />
      </div>
    </div>
  );
};

export default ResourceListItem;
