-- ============================================
-- 002: Registration Paths (Jalur Pendaftaran)
-- ============================================

-- 1. REGISTRATION_PATHS table
CREATE TABLE registration_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add registration_path_id and path-specific columns to participants
ALTER TABLE participants
  ADD COLUMN registration_path_id UUID REFERENCES registration_paths(id),
  ADD COLUMN parent_income TEXT,
  ADD COLUMN parent_occupation_father TEXT,
  ADD COLUMN parent_occupation_mother TEXT,
  ADD COLUMN dependents_count INTEGER,
  ADD COLUMN achievements TEXT,
  ADD COLUMN orphan_status TEXT CHECK (orphan_status IN ('yatim', 'piatu', 'yatim_piatu')),
  ADD COLUMN guardian_name TEXT,
  ADD COLUMN guardian_relation TEXT;

-- 3. Index
CREATE INDEX idx_participants_registration_path ON participants(registration_path_id);

-- 4. Updated_at trigger
DROP TRIGGER IF EXISTS update_registration_paths_updated_at ON registration_paths;

CREATE TRIGGER update_registration_paths_updated_at BEFORE UPDATE ON registration_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. RLS
ALTER TABLE registration_paths ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active paths" ON registration_paths;
DROP POLICY IF EXISTS "Admins can manage paths" ON registration_paths;

CREATE POLICY "Anyone can view active paths"
  ON registration_paths FOR SELECT
  USING (is_active = true OR (auth.jwt()->>'role') = 'admin');

CREATE POLICY "Admins can manage paths"
  ON registration_paths FOR ALL
  USING ((auth.jwt()->>'role') = 'admin');

-- 6. Seed 3 default paths
INSERT INTO registration_paths (name, slug, description, is_active, sort_order) VALUES
  ('Jalur Umum', 'umum', 'Pendaftaran reguler untuk semua siswa berdasarkan nilai akademik', true, 1),
  ('Jalur Beasiswa', 'beasiswa', 'Pendaftaran dengan pertimbangan prestasi dan kondisi ekonomi keluarga', true, 2),
  ('Jalur Beasiswa Yatim Piatu', 'beasiswa_yatim_piatu', 'Pendaftaran khusus siswa yatim/piatu dengan pertimbangan prestasi dan kondisi ekonomi', true, 3)
ON CONFLICT (slug) DO NOTHING;
