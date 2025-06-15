
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

export const useResources = (folderId?: string) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchResources = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('resources')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (folderId) {
        query = query.eq('folder_id', folderId);
      } else {
        query = query.is('folder_id', null);
      }

      const { data, error } = await query;

      if (error) throw error;
      setResources(data || []);
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
        title: "File deleted",
        description: "The file has been moved to trash",
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchResources();
  }, [user, folderId]);

  return {
    resources,
    loading,
    refetch: fetchResources,
    toggleFavorite,
    deleteResource,
  };
};
