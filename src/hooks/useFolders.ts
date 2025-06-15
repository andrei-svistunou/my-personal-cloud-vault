
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Folder {
  id: string;
  name: string;
  parent_folder_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFolders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setFolders(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast({
        title: "Error loading folders",
        description: "Failed to load your folders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (name: string, parentFolderId?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('folders')
        .insert({
          name,
          user_id: user.id,
          parent_folder_id: parentFolderId || null,
        })
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => [...prev, data]);
      toast({
        title: "Folder created",
        description: `"${name}" folder has been created`,
      });

      return data;
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  const updateFolder = async (folderId: string, name: string) => {
    try {
      const { error } = await supabase
        .from('folders')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', folderId);

      if (error) throw error;

      setFolders(prev => prev.map(folder => 
        folder.id === folderId ? { ...folder, name } : folder
      ));

      toast({
        title: "Folder updated",
        description: `Folder renamed to "${name}"`,
      });
    } catch (error) {
      console.error('Error updating folder:', error);
      toast({
        title: "Error",
        description: "Failed to update folder",
        variant: "destructive",
      });
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;

      setFolders(prev => prev.filter(folder => folder.id !== folderId));
      toast({
        title: "Folder deleted",
        description: "The folder has been deleted",
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "Failed to delete folder",
        variant: "destructive",
      });
    }
  };

  const assignResourceToFolder = async (resourceId: string, folderId: string) => {
    try {
      const { error } = await supabase
        .from('resource_folders')
        .insert({
          resource_id: resourceId,
          folder_id: folderId,
        });

      if (error) throw error;

      toast({
        title: "Resource assigned",
        description: "Resource has been added to the folder",
      });
    } catch (error) {
      console.error('Error assigning resource to folder:', error);
      toast({
        title: "Error",
        description: "Failed to assign resource to folder",
        variant: "destructive",
      });
    }
  };

  const removeResourceFromFolder = async (resourceId: string, folderId: string) => {
    try {
      const { error } = await supabase
        .from('resource_folders')
        .delete()
        .eq('resource_id', resourceId)
        .eq('folder_id', folderId);

      if (error) throw error;

      toast({
        title: "Resource removed",
        description: "Resource has been removed from the folder",
      });
    } catch (error) {
      console.error('Error removing resource from folder:', error);
      toast({
        title: "Error",
        description: "Failed to remove resource from folder",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [user]);

  return {
    folders,
    loading,
    refetch: fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    assignResourceToFolder,
    removeResourceFromFolder,
  };
};
