
import React from 'react';
import { Folder, Image, Video, File, Star, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const Sidebar = ({ selectedCategory, onCategoryChange }: SidebarProps) => {
  const categories = [
    { id: 'all', name: 'All Files', icon: File, count: 124 },
    { id: 'photos', name: 'Photos', icon: Image, count: 89 },
    { id: 'videos', name: 'Videos', icon: Video, count: 23 },
    { id: 'favorites', name: 'Favorites', icon: Star, count: 12 },
    { id: 'recent', name: 'Recent', icon: Clock, count: 15 },
    { id: 'trash', name: 'Trash', icon: Trash2, count: 3 },
  ];

  const folders = [
    { name: 'Family Photos', count: 45 },
    { name: 'Work Documents', count: 23 },
    { name: 'Travel', count: 67 },
    { name: 'Screenshots', count: 34 },
  ];

  return (
    <aside className="w-64 bg-gray-50/50 border-r border-gray-200 h-full">
      <div className="p-4">
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
    </aside>
  );
};

export default Sidebar;
