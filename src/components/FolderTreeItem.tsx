
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Folder as FolderType } from '@/hooks/useFolders';
import FolderDialog from './FolderDialog';

interface FolderTreeItemProps {
  folder: FolderType;
  level: number;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleExpand: (folderId: string) => void;
  onSelect: (folderId: string) => void;
  onRename: (folderId: string, currentName: string) => void;
  onDelete: (folderId: string) => void;
  onCreateSubfolder: (parentId: string, name: string) => void;
  children?: React.ReactNode;
}

const FolderTreeItem = ({
  folder,
  level,
  isSelected,
  isExpanded,
  onToggleExpand,
  onSelect,
  onRename,
  onDelete,
  onCreateSubfolder,
  children,
}: FolderTreeItemProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const hasChildren = React.Children.count(children) > 0;

  const handleCreateSubfolder = (name: string) => {
    onCreateSubfolder(folder.id, name);
    setShowCreateDialog(false);
  };

  return (
    <div>
      <div className="group flex items-center">
        <Button
          variant="ghost"
          className={`w-full justify-start h-9 hover:bg-gray-100 ${
            isSelected ? 'bg-blue-100 text-blue-700' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onSelect(folder.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(folder.id);
              }}
              className="mr-1 p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          
          {isExpanded ? (
            <FolderOpen className="mr-2 h-4 w-4 text-blue-500" />
          ) : (
            <Folder className="mr-2 h-4 w-4 text-blue-500" />
          )}
          
          <span className="flex-1 text-left text-sm truncate">{folder.name}</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Subfolder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRename(folder.id, folder.name)}>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(folder.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Button>
      </div>
      
      {isExpanded && children && (
        <div className="ml-2">
          {children}
        </div>
      )}

      <FolderDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateFolder={handleCreateSubfolder}
        title="Create Subfolder"
        description={`Create a new subfolder inside "${folder.name}"`}
      />
    </div>
  );
};

export default FolderTreeItem;
