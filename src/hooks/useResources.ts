
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Resource {
  id: string;
  name: string;
  original_name: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  thumbnail_path?: string;
  folder_id?: string;
  is_favorite: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useResources = (folderId?: string, showDeleted: boolean = false) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchResources = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query;
      
      if (folderId) {
        // Fetch resources assigned to a specific folder via resource_folders junction table
        query = supabase
          .from('resource_folders')
          .select(`
            resource_id,
            resources!inner (
              id,
              name,
              original_name,
              file_type,
              mime_type,
              file_size,
              storage_path,
              thumbnail_path,
              folder_id,
              is_favorite,
              is_deleted,
              created_at,
              updated_at,
              user_id
            )
          `)
          .eq('folder_id', folderId)
          .eq('resources.user_id', user.id)
          .eq('resources.is_deleted', showDeleted);
      } else {
        // Fetch all resources not in any folder (resources with no entries in resource_folders)
        const { data: resourcesInFolders } = await supabase
          .from('resource_folders')
          .select('resource_id');

        const resourceIdsInFolders = resourcesInFolders?.map(rf => rf.resource_id) || [];

        query = supabase
          .from('resources')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_deleted', showDeleted)
          .not('id', 'in', `(${resourceIdsInFolders.length > 0 ? resourceIdsInFolders.join(',') : 'null'})`)
          .order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      let resourcesData: Resource[] = [];
      
      if (folderId) {
        // Extract resources from the junction table query result
        resourcesData = data?.map((item: any) => item.resources) || [];
      } else {
        resourcesData = data || [];
      }

      setResources(resourcesData);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error loading resources",
        description: "Failed to load your files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;

    try {
      const { error } = await supabase
        .from('resources')
        .update({ is_favorite: !resource.is_favorite })
        .eq('id', resourceId);

      if (error) throw error;

      setResources(prev => prev.map(r => 
        r.id === resourceId ? { ...r, is_favorite: !r.is_favorite } : r
      ));

      toast({
        title: resource.is_favorite ? "Removed from favorites" : "Added to favorites",
        description: resource.name,
      });
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  const deleteResource = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', resourceId);

      if (error) throw error;

      setResources(prev => prev.filter(r => r.id !== resourceId));
      toast({
        title: "File moved to trash",
        description: "The file has been moved to trash",
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to move file to trash",
        variant: "destructive",
      });
    }
  };

  const restoreResource = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ is_deleted: false, deleted_at: null })
        .eq('id', resourceId);

      if (error) throw error;

      setResources(prev => prev.filter(r => r.id !== resourceId));
      toast({
        title: "File restored",
        description: "The file has been restored from trash",
      });
    } catch (error) {
      console.error('Error restoring resource:', error);
      toast({
        title: "Error",
        description: "Failed to restore file",
        variant: "destructive",
      });
    }
  };

  const permanentlyDeleteResource = async (resourceId: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;

      setResources(prev => prev.filter(r => r.id !== resourceId));
      toast({
        title: "File permanently deleted",
        description: "The file has been permanently deleted",
      });
    } catch (error) {
      console.error('Error permanently deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to permanently delete file",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchResources();
  }, [user, folderId, showDeleted]);

  return {
    resources,
    loading,
    refetch: fetchResources,
    toggleFavorite,
    deleteResource,
    restoreResource,
    permanentlyDeleteResource,
  };
};
