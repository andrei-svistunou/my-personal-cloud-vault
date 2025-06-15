
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadFiles = async (files: File[], folderId?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const uploadedResources = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resources')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Create resource record in database
        const { data: resourceData, error: dbError } = await supabase
          .from('resources')
          .insert({
            user_id: user.id,
            name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            original_name: file.name,
            file_type: getFileType(file.type),
            mime_type: file.type,
            file_size: file.size,
            storage_path: uploadData.path,
            folder_id: folderId || null,
          })
          .select()
          .single();

        if (dbError) throw dbError;
        uploadedResources.push(resourceData);
      }

      toast({
        title: "Upload successful",
        description: `${files.length} file(s) uploaded successfully`,
      });

      return uploadedResources;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  };

  return {
    uploadFiles,
    uploading,
    uploadProgress,
  };
};
