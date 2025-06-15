
import React from 'react';
import { Download, Star, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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

interface PreviewModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite?: (resourceId: string) => void;
  onDelete?: (resourceId: string) => void;
}

const PreviewModal = ({ resource, isOpen, onClose, onToggleFavorite, onDelete }: PreviewModalProps) => {
  const { toast } = useToast();
  
  if (!resource) return null;

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  const handleDownload = async () => {
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

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(resource.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(resource.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] p-0 [&>button]:hidden" 
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">
          {resource.name} Preview
        </DialogTitle>
        <DialogDescription className="sr-only">
          Preview of {resource.type} file: {resource.name}
        </DialogDescription>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {resource.name}
              </h2>
              <p className="text-sm text-gray-500">
                {resource.size} • {formatDate(resource.date)}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleToggleFavorite}>
                <Star className={`h-4 w-4 ${resource.isFavorite ? 'text-yellow-400 fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
            {resource.type === 'image' && (
              <img
                src={resource.thumbnail}
                alt={resource.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            )}
            {resource.type === 'video' && (
              <video
                controls
                className="max-w-full max-h-full rounded-lg shadow-lg"
                preload="metadata"
              >
                <source src={resource.thumbnail} type="video/mp4" />
                <source src={resource.thumbnail} type="video/webm" />
                <source src={resource.thumbnail} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            )}
            {resource.type === 'document' && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Document Preview</span>
                </div>
                <p className="text-gray-600">
                  Document preview not available
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
