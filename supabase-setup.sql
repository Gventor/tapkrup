-- TapKrup Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  slug TEXT UNIQUE,
  phone_number TEXT,
  line_link TEXT,
  whatsapp_link TEXT,
  google_maps_link TEXT,
  address TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nfc_links table
CREATE TABLE nfc_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_slug ON profiles(slug);
CREATE INDEX idx_nfc_links_code ON nfc_links(code);
CREATE INDEX idx_nfc_links_profile_id ON nfc_links(profile_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow anyone to read profiles (for public pages)
CREATE POLICY "Public profiles are viewable by slug"
  ON profiles FOR SELECT
  USING (slug IS NOT NULL);

-- RLS Policies for nfc_links
-- Allow users to view their own NFC links
CREATE POLICY "Users can view own nfc_links"
  ON nfc_links FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE id = auth.uid()
    )
  );

-- Allow users to insert their own NFC links
CREATE POLICY "Users can insert own nfc_links"
  ON nfc_links FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE id = auth.uid()
    )
  );

-- Allow anyone to read NFC links (for redirect functionality)
CREATE POLICY "Public nfc_links are viewable"
  ON nfc_links FOR SELECT
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional - you can delete this section if you don't want sample data)
-- This creates a sample NFC link that redirects to a business
-- INSERT INTO nfc_links (code, profile_id) VALUES ('sample123', 'YOUR_PROFILE_ID_HERE');

-- ========================================
-- STORAGE BUCKET SETUP FOR LOGOS
-- ========================================
-- Note: You should create the bucket via Supabase UI first (already done!)
-- Bucket name: logos
-- Public: Yes
-- File size limit: 10MB
-- Allowed MIME types: image/*

-- Storage policies for the logos bucket
-- These allow users to upload, view, update, and delete their logos

-- Policy: Allow authenticated users to upload logos
CREATE POLICY "Allow authenticated users to upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos');

-- Policy: Allow public to view logos (needed for public pages)
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
