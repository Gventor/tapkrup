-- Fix RLS Policies for Pages
-- Run this to fix the "violates row-level security policy" error

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own pages" ON pages;
DROP POLICY IF EXISTS "Users can view own pages" ON pages;
DROP POLICY IF EXISTS "Users can update own pages" ON pages;
DROP POLICY IF EXISTS "Users can delete own pages" ON pages;
DROP POLICY IF EXISTS "Public can view pages" ON pages;

-- Recreate with correct logic
CREATE POLICY "Users can view own pages" 
ON pages FOR SELECT 
USING (
  business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  )
  OR true
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

-- Done! Try creating a page again.
