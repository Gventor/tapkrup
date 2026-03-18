-- TapKrup Modular Block System Database
-- Run this to create the flexible block-based structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop all existing tables
DROP TABLE IF EXISTS nfc_links CASCADE;
DROP TABLE IF EXISTS page_blocks CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pages table (simplified - blocks hold the content)
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sub_slug TEXT,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, sub_slug)
);

-- Create page_blocks table (flexible content blocks)
CREATE TABLE page_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nfc_links table
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
CREATE INDEX idx_page_blocks_page_id ON page_blocks(page_id);
CREATE INDEX idx_page_blocks_order ON page_blocks(page_id, display_order);
CREATE INDEX idx_nfc_links_code ON nfc_links(code);
CREATE INDEX idx_nfc_links_page_id ON nfc_links(page_id);

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_links ENABLE ROW LEVEL SECURITY;

-- Businesses RLS
CREATE POLICY "Users can view own businesses" ON businesses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own businesses" ON businesses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own businesses" ON businesses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own businesses" ON businesses FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public can view businesses" ON businesses FOR SELECT USING (slug IS NOT NULL);

-- Pages RLS
CREATE POLICY "Users can view own pages" ON pages FOR SELECT USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own pages" ON pages FOR INSERT WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own pages" ON pages FOR UPDATE USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own pages" ON pages FOR DELETE USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
CREATE POLICY "Public can view pages" ON pages FOR SELECT USING (true);

-- Page Blocks RLS
CREATE POLICY "Users can view own blocks" ON page_blocks FOR SELECT USING (page_id IN (SELECT p.id FROM pages p JOIN businesses b ON p.business_id = b.id WHERE b.user_id = auth.uid()));
CREATE POLICY "Users can insert own blocks" ON page_blocks FOR INSERT WITH CHECK (page_id IN (SELECT p.id FROM pages p JOIN businesses b ON p.business_id = b.id WHERE b.user_id = auth.uid()));
CREATE POLICY "Users can update own blocks" ON page_blocks FOR UPDATE USING (page_id IN (SELECT p.id FROM pages p JOIN businesses b ON p.business_id = b.id WHERE b.user_id = auth.uid()));
CREATE POLICY "Users can delete own blocks" ON page_blocks FOR DELETE USING (page_id IN (SELECT p.id FROM pages p JOIN businesses b ON p.business_id = b.id WHERE b.user_id = auth.uid()));
CREATE POLICY "Public can view blocks" ON page_blocks FOR SELECT USING (true);

-- NFC Links RLS
CREATE POLICY "Users can view own nfc_links" ON nfc_links FOR SELECT USING (page_id IN (SELECT p.id FROM pages p JOIN businesses b ON p.business_id = b.id WHERE b.user_id = auth.uid()));
CREATE POLICY "Users can insert own nfc_links" ON nfc_links FOR INSERT WITH CHECK (page_id IN (SELECT p.id FROM pages p JOIN businesses b ON p.business_id = b.id WHERE b.user_id = auth.uid()));
CREATE POLICY "Public can view nfc_links" ON nfc_links FOR SELECT USING (true);

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_page_blocks_updated_at BEFORE UPDATE ON page_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Done! Your flexible block system is ready.
