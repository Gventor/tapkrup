-- Remove next_payment_date from villa_rentals
-- Run in Supabase SQL Editor

ALTER TABLE villa_rentals DROP COLUMN IF EXISTS next_payment_date;
