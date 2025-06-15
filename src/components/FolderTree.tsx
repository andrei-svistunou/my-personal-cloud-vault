
import React, { useState } from 'react';
import { Folder } from '@/hooks/useFolders';
import FolderTreeItem from './FolderTreeItem';

interface FolderTreeProps {
  folders: Folder[];
  selectedFolderId?: string;
  onFolderSelect: (folderId: string) => void;
  onFolderRename: (folderId: string, currentName: string) => void;
  onFolderDelete: (folderId: string) => void;
  onCreateSubfolder: (parentId: string, name: string) => void;
}

const FolderTree = ({
  folders,
  selectedFolderId,
  onFolderSelect,
  onFolderRename,
  onFolderDelete,
  onCreateSubfolder,
}: FolderTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Build folder hierarchy
  const buildFolderTree = (parentId: string | null = null, level: number = 0): React.ReactNode[] => {
    return folders
      .filter(folder => folder.parent_folder_id === parentId)
      .map(folder => {
        const children = buildFolderTree(folder.id, level + 1);
        const isExpanded = expandedFolders.has(folder.id);
        const isSelected = selectedFolderId === folder.id;

        return (
          <FolderTreeItem
            key={folder.id}
            folder={folder}
            level={level}
            isSelected={isSelected}
            isExpanded={isExpanded}
            onToggleExpand={toggleExpanded}
            onSelect={onFolderSelect}
            onRename={onFolderRename}
            onDelete={onFolderDelete}
            onCreateSubfolder={onCreateSubfolder}
          >
            {children}
          </FolderTreeItem>
        );
      });
  };

  return <div className="space-y-1">{buildFolderTree()}</div>;
};

export default FolderTree;
