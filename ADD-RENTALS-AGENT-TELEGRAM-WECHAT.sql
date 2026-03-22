-- Add agent_telegram and agent_wechat to villa_rentals and rentals
-- Run in Supabase SQL Editor - safe to run multiple times

ALTER TABLE villa_rentals ADD COLUMN IF NOT EXISTS agent_telegram TEXT;
ALTER TABLE villa_rentals ADD COLUMN IF NOT EXISTS agent_wechat TEXT;

-- Only if you have bikes / rentals table (run ADD-BIKES-RENTALS.sql first)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'rentals') THEN
    ALTER TABLE rentals ADD COLUMN IF NOT EXISTS agent_telegram TEXT;
    ALTER TABLE rentals ADD COLUMN IF NOT EXISTS agent_wechat TEXT;
  END IF;
END $$;
