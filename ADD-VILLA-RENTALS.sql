-- Villa Rental MVP
-- Run this in Supabase SQL Editor (you add manually)

-- Villas table (admin - full data)
CREATE TABLE villas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  beds INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Villa rentals (admin - full data, guest sees limited via nfc_code)
CREATE TABLE villa_rentals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  villa_id UUID NOT NULL REFERENCES villas(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rent_amount DECIMAL(12,2),
  deposit DECIMAL(12,2),
  tenant_name TEXT,
  tenant_phone TEXT,
  tenant_email TEXT,
  tenant_id_number TEXT,
  agent_phone TEXT,
  agent_line TEXT,
  agent_whatsapp TEXT,
  next_payment_date DATE,
  notes TEXT,
  nfc_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_villas_business_id ON villas(business_id);
CREATE INDEX idx_villa_rentals_villa_id ON villa_rentals(villa_id);
CREATE INDEX idx_villa_rentals_nfc_code ON villa_rentals(nfc_code);

-- RLS
ALTER TABLE villas ENABLE ROW LEVEL SECURITY;
ALTER TABLE villa_rentals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own villas" ON villas FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

CREATE POLICY "Users manage own villa rentals" ON villa_rentals FOR ALL
  USING (villa_id IN (SELECT id FROM villas WHERE business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())))
  WITH CHECK (villa_id IN (SELECT id FROM villas WHERE business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())));

-- Guest can read only rows with nfc_code (limited cols in app)
CREATE POLICY "Public read villa rental by nfc" ON villa_rentals FOR SELECT
  USING (nfc_code IS NOT NULL);

CREATE POLICY "Public read villas for rental" ON villas FOR SELECT USING (true);

-- Triggers
CREATE TRIGGER update_villas_updated_at BEFORE UPDATE ON villas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_villa_rentals_updated_at BEFORE UPDATE ON villa_rentals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
