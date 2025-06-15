
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderPlus } from 'lucide-react';

interface FolderDialogProps {
  onCreateFolder: (name: string) => void;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
}

const FolderDialog = ({ 
  onCreateFolder, 
  trigger, 
  isOpen: controlledOpen, 
  onClose, 
  title = "Create New Folder",
  description 
}: FolderDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onClose ? onClose : setInternalOpen;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreateFolder(folderName.trim());
      setFolderName('');
      if (controlledOpen === undefined) {
        setInternalOpen(false);
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(open);
    } else if (!open && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!folderName.trim()}>
              Create Folder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FolderDialog;
