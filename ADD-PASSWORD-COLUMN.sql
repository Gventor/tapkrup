-- Add password protection to pages
-- Run this in Supabase SQL Editor to add the password_hash column

-- Add password_hash column (nullable - null means no password protection)
ALTER TABLE pages
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Existing pages will have NULL password_hash = public access
-- When you set a password in the dashboard, we store bcrypt hash here
