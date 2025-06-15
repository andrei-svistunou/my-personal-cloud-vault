
import React, { useState } from 'react';
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
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(
    new Set(assignedFolderIds)
  );

  const handleFolderToggle = (folderId: string, isChecked: boolean) => {
    const newSelectedFolders = new Set(selectedFolders);
    
    if (isChecked) {
      newSelectedFolders.add(folderId);
      if (!assignedFolderIds.includes(folderId)) {
        onAssignToFolder(resourceId, folderId);
      }
    } else {
      newSelectedFolders.delete(folderId);
      if (assignedFolderIds.includes(folderId)) {
        onRemoveFromFolder(resourceId, folderId);
      }
    }
    
    setSelectedFolders(newSelectedFolders);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign "{resourceName}" to Folders</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
                      onCheckedChange={(checked) => 
                        handleFolderToggle(folder.id, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={folder.id}
                      className="flex items-center space-x-2 cursor-pointer flex-1"
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
