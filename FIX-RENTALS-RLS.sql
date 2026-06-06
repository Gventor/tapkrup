-- Fix RLS policies for villa_rentals and rentals
-- Run in Supabase SQL Editor if save fails (RLS blocking)
-- Run DROP-VILLA-RENTALS-NEXT-PAYMENT-DATE.sql first if you haven't (removes next_payment_date)

-- Villa rentals: user must own the business that owns the villa
DROP POLICY IF EXISTS "Users manage own villa rentals" ON villa_rentals;
CREATE POLICY "Users manage own villa rentals" ON villa_rentals
  FOR ALL
  USING (
    villa_id IN (
      SELECT v.id FROM villas v
      JOIN businesses b ON b.id = v.business_id
      WHERE b.user_id = auth.uid()
    )
  )
  WITH CHECK (
    villa_id IN (
      SELECT v.id FROM villas v
      JOIN businesses b ON b.id = v.business_id
      WHERE b.user_id = auth.uid()
    )
  );

-- Bike rentals: user must own the business that owns the bike
DROP POLICY IF EXISTS "Users can manage rentals for own business" ON rentals;
CREATE POLICY "Users can manage rentals for own business" ON rentals
  FOR ALL
  USING (
    bike_id IN (
      SELECT bk.id FROM bikes bk
      JOIN businesses b ON b.id = bk.business_id
      WHERE b.user_id = auth.uid()
    )
  )
  WITH CHECK (
    bike_id IN (
      SELECT bk.id FROM bikes bk
      JOIN businesses b ON b.id = bk.business_id
      WHERE b.user_id = auth.uid()
    )
  );
