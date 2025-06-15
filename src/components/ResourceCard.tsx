
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

interface ResourceCardProps {
  resource: Resource;
  onResourceClick: (resource: Resource) => void;
  onPreview: (resource: Resource, e?: React.MouseEvent) => void;
  onToggleFavorite: (resourceId: string, e: React.MouseEvent) => void;
  onDelete: (resourceId: string, e: React.MouseEvent) => void;
  formatFileSize: (size: string) => string;
  formatDate: (date: string) => string;
}

const ResourceCard = ({
  resource,
  onResourceClick,
  onPreview,
  onToggleFavorite,
  onDelete,
  formatFileSize,
  formatDate,
}: ResourceCardProps) => {
  return (
    <div
      className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={() => onResourceClick(resource)}
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={resource.thumbnail}
          alt={resource.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
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
          variant="grid"
        />
      </div>

      {resource.isFavorite && (
        <div className="absolute top-2 left-2">
          <Star className="h-4 w-4 text-yellow-400 fill-current drop-shadow-sm" />
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
