-- Add bikes and rentals tables for bike rental businesses
-- Run this in Supabase SQL Editor after ADD-PASSWORD-COLUMN.sql
--
-- Also add to .env.local:
-- SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
-- (Get from Supabase Dashboard > Settings > API)

-- Bikes table (inventory per business)
CREATE TABLE bikes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  bike_id TEXT NOT NULL,
  plate_number TEXT,
  model TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
  price_per_day DECIMAL(10,2) NOT NULL DEFAULT 0,
  odometer_km DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, bike_id)
);

-- Rentals table (rental records)
CREATE TABLE rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bike_id UUID NOT NULL REFERENCES bikes(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  phone TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  deposit DECIMAL(10,2) DEFAULT 0,
  km_start DECIMAL(10,2),
  km_end DECIMAL(10,2),
  nfc_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bikes_business_id ON bikes(business_id);
CREATE INDEX idx_bikes_status ON bikes(business_id, status);
CREATE INDEX idx_rentals_bike_id ON rentals(bike_id);
CREATE INDEX idx_rentals_nfc_code ON rentals(nfc_code);

-- RLS for bikes
ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view bikes" ON bikes FOR SELECT USING (true);
CREATE POLICY "Users can manage own business bikes" ON bikes FOR ALL 
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- RLS for rentals (via bikes -> business)
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view rentals by nfc_code" ON rentals FOR SELECT USING (true);
CREATE POLICY "Users can manage rentals for own business" ON rentals FOR ALL 
  USING (bike_id IN (SELECT id FROM bikes WHERE business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())));

-- Triggers for updated_at
CREATE TRIGGER update_bikes_updated_at BEFORE UPDATE ON bikes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rentals_updated_at BEFORE UPDATE ON rentals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
