
import React from 'react';
import { MoreHorizontal, Eye, Star, Trash2, RotateCcw, Folder } from 'lucide-react';
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
  onToggleFavorite: (resourceId: string) => void;
  onDelete: (resourceId: string) => void;
  onRestore?: (resourceId: string) => void;
  onAssignToFolder?: (resource: Resource, e?: React.MouseEvent) => void;
  variant?: 'grid' | 'list';
  isTrashView?: boolean;
}

const ResourceActions = ({
  resource,
  onPreview,
  onToggleFavorite,
  onDelete,
  onRestore,
  onAssignToFolder,
  variant = 'grid',
  isTrashView = false,
}: ResourceActionsProps) => {
  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview(resource, e);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(resource.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(resource.id);
  };

  const handleRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRestore) {
      onRestore(resource.id);
    }
  };

  const handleAssignToFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAssignToFolder) {
      onAssignToFolder(resource, e);
    }
  };

  if (variant === 'grid') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          
          {!isTrashView && (
            <>
              <DropdownMenuItem onClick={handleToggleFavorite}>
                <Star className={`mr-2 h-4 w-4 ${resource.isFavorite ? 'fill-current text-yellow-400' : ''}`} />
                {resource.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </DropdownMenuItem>
              
              {onAssignToFolder && (
                <DropdownMenuItem onClick={handleAssignToFolder}>
                  <Folder className="mr-2 h-4 w-4" />
                  Assign to folder
                </DropdownMenuItem>
              )}
            </>
          )}
          
          {isTrashView && onRestore ? (
            <DropdownMenuItem onClick={handleRestore}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore
            </DropdownMenuItem>
          ) : null}
          
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            {isTrashView ? 'Delete permanently' : 'Move to trash'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handlePreview}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {!isTrashView && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleToggleFavorite}
          >
            <Star className={`h-4 w-4 ${resource.isFavorite ? 'fill-current text-yellow-400' : ''}`} />
          </Button>
          
          {onAssignToFolder && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleAssignToFolder}
            >
              <Folder className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
      
      {isTrashView && onRestore ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleRestore}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      ) : null}
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ResourceActions;
