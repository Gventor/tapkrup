-- Fix Existing Profile Data
-- Run this if you already have a profile but the slug is not working

-- Check your current profile data
SELECT 
  id,
  business_name,
  slug,
  created_at
FROM profiles;

-- If you see your profile but slug is NULL or empty, 
-- you can manually set it here:

-- Example: Update slug for a specific profile
-- Replace 'YOUR_USER_ID' with your actual user ID from the query above
-- Replace 'ladynayavillas' with your desired slug

-- UPDATE profiles 
-- SET slug = 'ladynayavillas'
-- WHERE id = 'YOUR_USER_ID';

-- Or if you want to auto-generate from business_name:
-- UPDATE profiles 
-- SET slug = LOWER(REGEXP_REPLACE(business_name, '[^a-zA-Z0-9]', '', 'g'))
-- WHERE slug IS NULL OR slug = '';

-- After running this, refresh your dashboard and the slug should appear!
