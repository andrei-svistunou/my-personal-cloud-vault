
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder } from 'lucide-react';
import { Folder as FolderType } from '@/hooks/useFolders';

interface ResourceFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string;
  resourceName: string;
  folders: FolderType[];
  onAssignToFolder: (resourceId: string, folderId: string) => void;
  onRemoveFromFolder: (resourceId: string, folderId: string) => void;
  assignedFolderIds: string[];
}

const ResourceFolderDialog = ({
  isOpen,
  onClose,
  resourceId,
  resourceName,
  folders,
  onAssignToFolder,
  onRemoveFromFolder,
  assignedFolderIds,
}: ResourceFolderDialogProps) => {
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set());

  // Update selectedFolders when assignedFolderIds changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFolders(new Set(assignedFolderIds));
    }
  }, [assignedFolderIds, isOpen]);

  const handleFolderToggle = async (folderId: string, isChecked: boolean) => {
    console.log('Folder toggle:', folderId, isChecked);
    
    const newSelectedFolders = new Set(selectedFolders);
    
    if (isChecked) {
      newSelectedFolders.add(folderId);
      if (!assignedFolderIds.includes(folderId)) {
        await onAssignToFolder(resourceId, folderId);
      }
    } else {
      newSelectedFolders.delete(folderId);
      if (assignedFolderIds.includes(folderId)) {
        await onRemoveFromFolder(resourceId, folderId);
      }
    }
    
    setSelectedFolders(newSelectedFolders);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    // Prevent any event propagation that might close the dialog
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md" 
        onInteractOutside={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onClick={handleContentClick}
      >
        <DialogHeader>
          <DialogTitle>Assign "{resourceName}" to Folders</DialogTitle>
        </DialogHeader>
        <div className="space-y-4" onClick={handleContentClick}>
          {folders.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No folders available</p>
              <p className="text-sm">Create a folder first to organize your resources</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {folders.map((folder) => (
                  <div key={folder.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={folder.id}
                      checked={selectedFolders.has(folder.id)}
                      onCheckedChange={(checked) => {
                        handleFolderToggle(folder.id, checked as boolean);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label 
                      htmlFor={folder.id}
                      className="flex items-center space-x-2 cursor-pointer flex-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const isCurrentlyChecked = selectedFolders.has(folder.id);
                        handleFolderToggle(folder.id, !isCurrentlyChecked);
                      }}
                    >
                      <Folder className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{folder.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          <div className="flex justify-end">
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceFolderDialog;
