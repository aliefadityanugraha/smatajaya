-- ============================================
-- 007: Add 'accepted' to participants status CHECK
-- ============================================

ALTER TABLE participants DROP CONSTRAINT IF EXISTS participants_status_check;
ALTER TABLE participants ADD CONSTRAINT participants_status_check
  CHECK (status IN ('draft','submitted','waiting_verification','needs_revision','verified','accepted'));
