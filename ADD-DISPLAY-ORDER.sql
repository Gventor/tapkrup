-- Add display_order column to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_pages_display_order ON pages(business_id, display_order);
