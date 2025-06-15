
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useFolders } from '@/hooks/useFolders';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

interface BreadcrumbNavigationProps {
  currentFolderId?: string;
  onNavigate: (category: string) => void;
}

const BreadcrumbNavigation = ({ currentFolderId, onNavigate }: BreadcrumbNavigationProps) => {
  const { folders } = useFolders();

  const getFolderPath = (folderId: string): Array<{ id: string; name: string }> => {
    const path: Array<{ id: string; name: string }> = [];
    let currentFolder = folders.find(f => f.id === folderId);
    
    while (currentFolder) {
      path.unshift({ id: currentFolder.id, name: currentFolder.name });
      currentFolder = currentFolder.parent_folder_id 
        ? folders.find(f => f.id === currentFolder!.parent_folder_id) 
        : undefined;
    }
    
    return path;
  };

  if (!currentFolderId) return null;

  const folderPath = getFolderPath(currentFolderId);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink 
            onClick={() => onNavigate('all')}
            className="cursor-pointer flex items-center"
          >
            <Home className="h-4 w-4 mr-1" />
            All Files
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {folderPath.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {index === folderPath.length - 1 ? (
                <BreadcrumbPage>{folder.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink 
                  onClick={() => onNavigate(`folder:${folder.id}`)}
                  className="cursor-pointer"
                >
                  {folder.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNavigation;
