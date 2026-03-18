-- Update Script for Existing TapKrup Databases
-- Run this ONLY if you already created the profiles table
-- This adds the logo_url column to support logo uploads

-- Add logo_url column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- That's it! Your database is now ready for logo uploads.
-- Next step: Create the storage bucket (see SUPABASE-STORAGE-SETUP.md)
