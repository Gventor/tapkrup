-- Check if profile exists with slug
SELECT id, business_name, slug FROM profiles;

-- If you see your profile but slug is NULL, run this:
-- UPDATE profiles SET slug = 'ladynayavillas' WHERE business_name LIKE '%Lady%';
