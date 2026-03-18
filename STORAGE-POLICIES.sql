-- Storage Policies for Logos Bucket
-- Run this in Supabase SQL Editor AFTER creating the logos bucket
-- Your bucket is already created with these settings:
-- - Bucket name: logos
-- - Public: Yes
-- - File size limit: 10MB (bucket) / 2MB (app enforces for fast loading)
-- - Allowed MIME types: image/*

-- Policy 1: Allow authenticated users to upload logos
CREATE POLICY "Allow authenticated users to upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos');

-- Policy 2: Allow public to view logos (needed for public business pages)
CREATE POLICY "Allow public to view logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');

-- Policy 3: Allow users to update their own logos
CREATE POLICY "Allow users to update their own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'logos');

-- Policy 4: Allow users to delete their own logos
CREATE POLICY "Allow users to delete their own logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'logos');

-- Done! Your storage is now ready for logo uploads.
