-- Add rent_amount (price) to bike rentals - same as villa_rentals
-- Run in Supabase SQL Editor - safe to run multiple times

ALTER TABLE rentals ADD COLUMN IF NOT EXISTS rent_amount DECIMAL(10,2);
