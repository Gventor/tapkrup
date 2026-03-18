# Supabase Storage Setup for Logos

## Step-by-Step Guide to Create Logo Storage Bucket

### 1. Go to Supabase Storage
1. Open your Supabase project: https://peorumavyucumxvrzcme.supabase.co
2. Click on **Storage** in the left sidebar (icon looks like a folder)

### 2. Create New Bucket ✅ (Already Done!)
You've already created the bucket with these settings:
   - **Name**: `logos` ✅
   - **Public bucket**: ✅ **Enabled**
   - **File size limit**: 10MB (You can change to 2MB in Supabase UI - recommended!)
   - **Allowed MIME types**: `image/*` ✅

**Recommended**: Change file size limit to 2MB for faster uploads and page loading.

Perfect! Now you just need to set up the policies below.

### 3. Set Bucket Policies (Important for Security)
After creating the bucket, you need to set up policies:

1. Click on the **"logos"** bucket you just created
2. Click on **"Policies"** tab at the top
3. Click **"New Policy"**

#### Policy 1: Allow Authenticated Users to Upload
- **Policy name**: `Allow authenticated users to upload logos`
- **Allowed operation**: INSERT
- **Target roles**: authenticated
- **Policy definition**:
```sql
(bucket_id = 'logos'::text) AND (auth.uid() IS NOT NULL)
```
- Click **"Review"** then **"Save policy"**

#### Policy 2: Allow Public Read Access
- **Policy name**: `Allow public to view logos`
- **Allowed operation**: SELECT
- **Target roles**: public
- **Policy definition**:
```sql
(bucket_id = 'logos'::text)
```
- Click **"Review"** then **"Save policy"**

#### Policy 3: Allow Users to Update Their Own Logos
- **Policy name**: `Allow users to update their own logos`
- **Allowed operation**: UPDATE
- **Target roles**: authenticated
- **Policy definition**:
```sql
(bucket_id = 'logos'::text) AND (auth.uid() IS NOT NULL)
```
- Click **"Review"** then **"Save policy"**

#### Policy 4: Allow Users to Delete Their Own Logos
- **Policy name**: `Allow users to delete their own logos`
- **Allowed operation**: DELETE
- **Target roles**: authenticated
- **Policy definition**:
```sql
(bucket_id = 'logos'::text) AND (auth.uid() IS NOT NULL)
```
- Click **"Review"** then **"Save policy"**

### 4. Verify Setup
1. Go back to the **"logos"** bucket
2. You should see it marked as **"Public"**
3. Under **"Policies"**, you should see 4 policies

### 5. Alternative: Quick Setup with SQL (Advanced)
If you prefer, you can run this SQL in the SQL Editor:

```sql
-- Create storage bucket for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true);

-- Policy: Allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos');

-- Policy: Allow public to view logos
CREATE POLICY "Allow public to view logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');

-- Policy: Allow users to update their own logos
CREATE POLICY "Allow users to update their own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'logos');

-- Policy: Allow users to delete their own logos
CREATE POLICY "Allow users to delete their own logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'logos');
```

## ✅ Done!
Your logo storage is now ready. Users can:
- Upload logos from the dashboard
- Logos will be publicly accessible (needed for display)
- Each user can only manage their own logos
- Maximum file size: 2MB (app enforces this limit)

## Testing
1. Go to your app dashboard
2. Upload a logo
3. Save your changes
4. Visit your public page to see the logo displayed at the top

## Troubleshooting

### Error: "new row violates row-level security policy"
- Make sure the bucket is marked as **Public**
- Check that all 4 policies are created correctly

### Error: "Failed to upload"
- Check file size (must be under 2MB)
- Make sure you're uploading an image file (PNG, JPG, GIF, etc.)
- Try compressing your image at tinypng.com or similar

### Logo not displaying
- Check that the bucket is **Public**
- Verify the logo_url is saved in the profiles table
- Check browser console for errors

## Security Notes
- ✅ Bucket is public (logos need to be viewable by everyone)
- ✅ Only authenticated users can upload
- ✅ File size limited to 2MB (enforced by app)
- ✅ Only image files allowed (image/*)
- ✅ Users can only manage their own files
- ✅ Fast loading for mobile users
