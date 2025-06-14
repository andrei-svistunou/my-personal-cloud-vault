
import React from 'react';
import { MoreVertical, Star, Download, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Resource {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  date: string;
  thumbnail: string;
  isFavorite: boolean;
}

interface ResourceGridProps {
  resources: Resource[];
  viewMode: 'grid' | 'list';
  onResourceClick: (resource: Resource) => void;
}

const ResourceGrid = ({ resources, viewMode, onResourceClick }: ResourceGridProps) => {
  const formatFileSize = (size: string) => size;
  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {resources.map((resource) => (
          <div
            key={resource.id}
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
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Star className="mr-2 h-4 w-4" />
                    Add to Favorites
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {resources.map((resource) => (
        <div
          key={resource.id}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 text-white border-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {resource.isFavorite && (
            <div className="absolute top-2 left-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current drop-shadow-sm" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResourceGrid;
