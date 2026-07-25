-- ============================================
-- 005: Phase 2 — Test Schedules & Final Status
-- ============================================

-- 1. TEST_SCHEDULES table
CREATE TABLE test_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_number INT NOT NULL CHECK (test_number BETWEEN 1 AND 6),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Unique constraint on test_number (one row per test)
ALTER TABLE test_schedules ADD CONSTRAINT uq_test_schedules_test_number UNIQUE (test_number);

-- 3. Add Phase 2 columns to participants
ALTER TABLE participants
  ADD COLUMN final_status TEXT CHECK (final_status IN ('pending', 'lulus', 'tidak_lulus')) DEFAULT 'pending',
  ADD COLUMN admin_decision_at TIMESTAMPTZ,
  ADD COLUMN announcement_date DATE,
  ADD COLUMN announcement_revealed BOOLEAN DEFAULT false;

-- 4. Updated_at trigger for test_schedules
DROP TRIGGER IF EXISTS update_test_schedules_updated_at ON test_schedules;

CREATE TRIGGER update_test_schedules_updated_at BEFORE UPDATE ON test_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. RLS for test_schedules
ALTER TABLE test_schedules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view test schedules" ON test_schedules;
DROP POLICY IF EXISTS "Admins can manage test schedules" ON test_schedules;

CREATE POLICY "Anyone can view test schedules"
  ON test_schedules FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage test schedules"
  ON test_schedules FOR ALL
  USING ((auth.jwt()->>'role') = 'admin');

-- 6. Seed 6 default test schedules
INSERT INTO test_schedules (test_number, name, date, time, location) VALUES
  (1, 'Tes Kesehatan Jiwa & Kesehatan Umum', '2026-08-01', '08:00', 'SMAN 5 Taruna Brawijaya'),
  (2, 'Tes Akademik', '2026-08-03', '08:00', 'SMAN 5 Taruna Brawijaya'),
  (3, 'Tes Psikologi', '2026-08-05', '08:00', 'SMAN 5 Taruna Brawijaya'),
  (4, 'Tes Kesegaran Jasmani', '2026-08-07', '07:00', 'Lapangan SMAN 5 Taruna Brawijaya'),
  (5, 'Tes Wawancara', '2026-08-09', '08:00', 'Ruang Guru SMAN 5 Taruna Brawijaya'),
  (6, 'Tes Pantukhir', '2026-08-11', '08:00', 'Ruang Rapat SMAN 5 Taruna Brawijaya')
ON CONFLICT (test_number) DO NOTHING;
