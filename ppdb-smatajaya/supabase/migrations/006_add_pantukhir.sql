-- ============================================
-- 006: Add Tes Pantukhir (Test #6) + Fix Constraint
-- ============================================

-- 1. Update CHECK constraint to allow test_number 1-6
ALTER TABLE test_schedules DROP CONSTRAINT IF EXISTS test_schedules_test_number_check;
ALTER TABLE test_schedules ADD CONSTRAINT test_schedules_test_number_check CHECK (test_number BETWEEN 1 AND 6);

-- 2. Seed Tes Pantukhir
INSERT INTO test_schedules (test_number, name, date, time, location) VALUES
  (6, 'Tes Pantukhir', '2026-08-11', '08:00', 'Ruang Rapat SMAN 5 Taruna Brawijaya')
ON CONFLICT (test_number) DO NOTHING;
