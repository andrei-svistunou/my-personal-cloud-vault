
import React from 'react';
import { MoreVertical, Star, Download, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
}

interface ResourceActionsProps {
  resource: Resource;
  onPreview: (resource: Resource, e?: React.MouseEvent) => void;
  onToggleFavorite: (resourceId: string) => void;
  onDelete: (resourceId: string) => void;
  variant?: 'grid' | 'list';
}

const ResourceActions = ({ 
  resource, 
  onPreview, 
  onToggleFavorite, 
  onDelete, 
  variant = 'list' 
}: ResourceActionsProps) => {
  const { toast } = useToast();

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!resource.storage_path) {
      toast({
        title: "Download failed",
        description: "File path not available",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('resources')
        .download(resource.storage_path);

      if (error) throw error;

      // Use original_name if available, otherwise fall back to resource.name
      const filename = resource.original_name || resource.name;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: filename,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(resource.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(resource.id);
  };

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
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e) => onPreview(resource, e)}>
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleFavorite}>
          <Star className="mr-2 h-4 w-4" />
          {resource.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResourceActions;
