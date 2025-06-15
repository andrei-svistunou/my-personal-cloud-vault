
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

interface ResourceActionsProps {
  resource: Resource;
  onPreview: (resource: Resource, e?: React.MouseEvent) => void;
  onToggleFavorite: (resourceId: string, e: React.MouseEvent) => void;
  onDelete: (resourceId: string, e: React.MouseEvent) => void;
  variant?: 'grid' | 'list';
}

const ResourceActions = ({ 
  resource, 
  onPreview, 
  onToggleFavorite, 
  onDelete, 
  variant = 'list' 
}: ResourceActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant === 'grid' ? 'secondary' : 'ghost'} 
          size="sm" 
          className={
            variant === 'grid' 
              ? "h-8 w-8 p-0 bg-black/20 hover:bg-black/40 text-white border-0"
              : "h-8 w-8 p-0"
          }
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e) => onPreview(resource, e)}>
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => onToggleFavorite(resource.id, e)}>
          <Star className="mr-2 h-4 w-4" />
          {resource.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={(e) => onDelete(resource.id, e)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResourceActions;
