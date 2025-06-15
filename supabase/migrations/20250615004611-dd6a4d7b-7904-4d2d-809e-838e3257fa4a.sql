
-- Create a junction table for the many-to-many relationship between resources and folders
CREATE TABLE public.resource_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  folder_id UUID NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(resource_id, folder_id)
);

-- Enable RLS on resource_folders table
ALTER TABLE public.resource_folders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for resource_folders
CREATE POLICY "Users can view their own resource_folders" ON public.resource_folders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.resources 
      WHERE resources.id = resource_folders.resource_id 
      AND resources.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own resource_folders" ON public.resource_folders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.resources 
      WHERE resources.id = resource_folders.resource_id 
      AND resources.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own resource_folders" ON public.resource_folders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.resources 
      WHERE resources.id = resource_folders.resource_id 
      AND resources.user_id = auth.uid()
    )
  );
