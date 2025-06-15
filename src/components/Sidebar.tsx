
import React from 'react';
import { Folder, Image, Video, File, Star, Trash2, Clock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

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

  const categories = [
    { id: 'all', name: 'All Files', icon: File, count: resourceCounts.all },
    { id: 'photos', name: 'Photos', icon: Image, count: resourceCounts.photos },
    { id: 'videos', name: 'Videos', icon: Video, count: resourceCounts.videos },
    { id: 'favorites', name: 'Favorites', icon: Star, count: resourceCounts.favorites },
    { id: 'recent', name: 'Recent', icon: Clock, count: resourceCounts.recent },
    { id: 'trash', name: 'Trash', icon: Trash2, count: resourceCounts.trash },
  ];

  const folders = [
    { name: 'Family Photos', count: 0 },
    { name: 'Work Documents', count: 0 },
    { name: 'Travel', count: 0 },
    { name: 'Screenshots', count: 0 },
  ];

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
          <h3 className="text-sm font-medium text-gray-500 mb-3">Folders</h3>
          <div className="space-y-1">
            {folders.map((folder) => (
              <Button
                key={folder.name}
                variant="ghost"
                className="w-full justify-start h-9 hover:bg-gray-100"
              >
                <Folder className="mr-3 h-4 w-4 text-blue-500" />
                <span className="flex-1 text-left text-sm">{folder.name}</span>
                <span className="text-xs text-gray-400">{folder.count}</span>
              </Button>
            ))}
          </div>
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
