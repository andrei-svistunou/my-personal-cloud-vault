
-- Add Row Level Security policies for resource_folders table (only if not already enabled)
DO $$ 
BEGIN
    -- Check if RLS is already enabled for resource_folders
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'resource_folders' AND relrowsecurity = true) THEN
        ALTER TABLE public.resource_folders ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Check if RLS is already enabled for resources
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'resources' AND relrowsecurity = true) THEN
        ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policy for resource_folders (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can manage their own resource_folders via folders' AND polrelid = 'resource_folders'::regclass) THEN
        CREATE POLICY "Users can manage their own resource_folders via folders" 
          ON public.resource_folders 
          FOR ALL 
          USING (
            EXISTS (
              SELECT 1 FROM public.folders 
              WHERE folders.id = resource_folders.folder_id 
              AND folders.user_id = auth.uid()
            )
          );
    END IF;
END $$;

-- Create policies for resources table (only if they don't exist)
DO $$ 
BEGIN
    -- SELECT policy
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can view their own resources' AND polrelid = 'resources'::regclass) THEN
        CREATE POLICY "Users can view their own resources" 
          ON public.resources 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    -- INSERT policy
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can create their own resources' AND polrelid = 'resources'::regclass) THEN
        CREATE POLICY "Users can create their own resources" 
          ON public.resources 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    -- UPDATE policy
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can update their own resources' AND polrelid = 'resources'::regclass) THEN
        CREATE POLICY "Users can update their own resources" 
          ON public.resources 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    -- DELETE policy
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Users can delete their own resources' AND polrelid = 'resources'::regclass) THEN
        CREATE POLICY "Users can delete their own resources" 
          ON public.resources 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create the folder hierarchy function (replace if exists)
CREATE OR REPLACE FUNCTION get_folder_path(folder_id UUID)
RETURNS TEXT AS $$
DECLARE
  path TEXT := '';
  current_folder RECORD;
  parent_id UUID;
BEGIN
  IF folder_id IS NULL THEN
    RETURN '';
  END IF;
  
  SELECT id, name, parent_folder_id INTO current_folder FROM folders WHERE id = folder_id;
  
  IF NOT FOUND THEN
    RETURN '';
  END IF;
  
  path := current_folder.name;
  parent_id := current_folder.parent_folder_id;
  
  WHILE parent_id IS NOT NULL LOOP
    SELECT name, parent_folder_id INTO current_folder FROM folders WHERE id = parent_id;
    IF NOT FOUND THEN
      EXIT;
    END IF;
    path := current_folder.name || ' / ' || path;
    parent_id := current_folder.parent_folder_id;
  END LOOP;
  
  RETURN path;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
