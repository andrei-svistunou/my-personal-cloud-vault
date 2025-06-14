
import React from 'react';
import { Download, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface Resource {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  date: string;
  thumbnail: string;
  isFavorite: boolean;
}

interface PreviewModalProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

const PreviewModal = ({ resource, isOpen, onClose }: PreviewModalProps) => {
  if (!resource) return null;

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
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
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Star className={`h-4 w-4 ${resource.isFavorite ? 'text-yellow-400 fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600">
                <Trash2 className="h-4 w-4" />
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
                poster={resource.thumbnail}
              >
                <source src={resource.thumbnail} type="video/mp4" />
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
