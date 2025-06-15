
import React, { useState } from 'react';
import { Folder, Image, Video, File, Star, Trash2, Clock, LogOut, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useFolders } from '@/hooks/useFolders';
import FolderDialog from './FolderDialog';
import FolderTree from './FolderTree';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  resourceCounts: {
    all: number;
    photos: number;
    videos: number;
    favorites: number;
    recent: number;
    trash: number;
  };
}

const Sidebar = ({ selectedCategory, onCategoryChange, resourceCounts }: SidebarProps) => {
  const { signOut, user } = useAuth();
  const { folders, createFolder, updateFolder, deleteFolder } = useFolders();
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const categories = [
    { id: 'all', name: 'All Files', icon: File, count: resourceCounts.all },
    { id: 'photos', name: 'Photos', icon: Image, count: resourceCounts.photos },
    { id: 'videos', name: 'Videos', icon: Video, count: resourceCounts.videos },
    { id: 'favorites', name: 'Favorites', icon: Star, count: resourceCounts.favorites },
    { id: 'recent', name: 'Recent', icon: Clock, count: resourceCounts.recent },
    { id: 'trash', name: 'Trash', icon: Trash2, count: resourceCounts.trash },
  ];

  const handleFolderCreate = (name: string) => {
    createFolder(name);
  };

  const handleSubfolderCreate = (parentId: string, name: string) => {
    createFolder(name, parentId);
  };

  const handleFolderSelect = (folderId: string) => {
    onCategoryChange(`folder:${folderId}`);
  };

  const handleFolderRename = (folderId: string, currentName: string) => {
    setEditingFolderId(folderId);
    setEditingName(currentName);
  };

  const handleFolderRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFolderId && editingName.trim()) {
      updateFolder(editingFolderId, editingName.trim());
      setEditingFolderId(null);
      setEditingName('');
    }
  };

  const handleFolderDelete = (folderId: string) => {
    deleteFolder(folderId);
  };

  const selectedFolderId = selectedCategory.startsWith('folder:') 
    ? selectedCategory.replace('folder:', '') 
    : undefined;

  return (
    <aside className="w-64 bg-gray-50/50 border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 flex-1">
        <div className="space-y-1">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                className={`w-full justify-start h-10 ${
                  selectedCategory === category.id 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                <span className="flex-1 text-left">{category.name}</span>
                <span className="text-xs opacity-60">{category.count}</span>
              </Button>
            );
          })}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">Folders</h3>
            <FolderDialog 
              onCreateFolder={handleFolderCreate}
              trigger={
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              }
            />
          </div>
          
          {editingFolderId ? (
            <div className="px-2 mb-2">
              <form onSubmit={handleFolderRenameSubmit}>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => {
                    setEditingFolderId(null);
                    setEditingName('');
                  }}
                  className="w-full text-sm bg-transparent border-none outline-none"
                  autoFocus
                />
              </form>
            </div>
          ) : null}

          <FolderTree
            folders={folders}
            selectedFolderId={selectedFolderId}
            onFolderSelect={handleFolderSelect}
            onFolderRename={handleFolderRename}
            onFolderDelete={handleFolderDelete}
            onCreateSubfolder={handleSubfolderCreate}
          />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 mb-2">
          {user?.email}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
