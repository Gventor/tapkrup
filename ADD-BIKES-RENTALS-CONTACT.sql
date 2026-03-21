-- Add contact columns to rentals (same as villa_rentals)
-- Run in Supabase SQL Editor - safe to run multiple times

ALTER TABLE rentals ADD COLUMN IF NOT EXISTS agent_phone TEXT;
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS agent_line TEXT;
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS agent_whatsapp TEXT;
