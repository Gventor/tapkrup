-- NEW TapKrup Database Schema
-- Run this to create the new multi-business, multi-page structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop old tables if they exist (in correct order)
DROP TABLE IF EXISTS nfc_links CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create businesses table (one user can have many businesses)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pages table (one business can have many pages)
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sub_slug TEXT,
  description TEXT,
  
  -- Contact Info
  phone_number TEXT,
  email TEXT,
  website_url TEXT,
  
  -- Social Media
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  tiktok_url TEXT,
  youtube_url TEXT,
  linkedin_url TEXT,
  
  -- Messaging Apps
  line_link TEXT,
  whatsapp_link TEXT,
  telegram_link TEXT,
  wechat_id TEXT,
  
  -- Location
  address TEXT,
  google_maps_link TEXT,
  
  -- Business Hours
  opening_hours TEXT,
  
  -- Custom Fields
  custom_text_1 TEXT,
  custom_text_2 TEXT,
  custom_link_1 TEXT,
  custom_link_2 TEXT,
  
  -- Template
  template_type TEXT DEFAULT 'default',
  
  -- Order
  display_order INTEGER DEFAULT 0,
  is_main BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(business_id, sub_slug)
);

-- Create nfc_links table (must be after pages table)
CREATE TABLE nfc_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_pages_business_id ON pages(business_id);
CREATE INDEX idx_pages_sub_slug ON pages(business_id, sub_slug);
CREATE INDEX idx_nfc_links_code ON nfc_links(code);
CREATE INDEX idx_nfc_links_page_id ON nfc_links(page_id);

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for businesses
CREATE POLICY "Users can view own businesses"
  ON businesses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own businesses"
  ON businesses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own businesses"
  ON businesses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own businesses"
  ON businesses FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view businesses by slug"
  ON businesses FOR SELECT
  USING (slug IS NOT NULL);

-- RLS Policies for pages
CREATE POLICY "Users can view own pages"
  ON pages FOR SELECT
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own pages"
  ON pages FOR INSERT
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own pages"
  ON pages FOR UPDATE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own pages"
  ON pages FOR DELETE
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view pages"
  ON pages FOR SELECT
  USING (true);

-- RLS Policies for nfc_links
CREATE POLICY "Users can view own nfc_links"
  ON nfc_links FOR SELECT
  USING (
    page_id IN (
      SELECT p.id FROM pages p
      JOIN businesses b ON p.business_id = b.id
      WHERE b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own nfc_links"
  ON nfc_links FOR INSERT
  WITH CHECK (
    page_id IN (
      SELECT p.id FROM pages p
      JOIN businesses b ON p.business_id = b.id
      WHERE b.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view nfc_links"
  ON nfc_links FOR SELECT
  USING (true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Done! Your new database structure is ready.
