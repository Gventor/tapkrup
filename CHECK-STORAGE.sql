-- Check if Storage Policies Already Exist
-- Run this to verify your storage is set up correctly

-- Check if logos bucket exists
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE name = 'logos';

-- Check existing policies on storage.objects
SELECT 
  policyname,
  tablename,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%logo%';

-- If you see 4 policies listed above, you're all set! ✅
-- The policies are:
-- 1. Allow authenticated users to upload logos (INSERT)
-- 2. Allow public to view logos (SELECT)
-- 3. Allow users to update their own logos (UPDATE)
-- 4. Allow users to delete their own logos (DELETE)
