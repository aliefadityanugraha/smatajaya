-- Migration 009: Site settings table for admin-controlled UI toggles
-- Stores key-value pairs for site-wide configuration

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: only admin can read/write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage site settings"
  ON site_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can read site settings"
  ON site_settings
  FOR SELECT
  USING (true);

-- Seed default values
INSERT INTO site_settings (key, value, description) VALUES
  ('registration_open', 'true', 'Status pendaftaran PPDB (true/false)'),
  ('registration_message', '"Penerimaan Telah Dibuka"', 'Pesan status di hero landing page'),
  ('site_title', '"Penerimaan Peserta Didik Baru"', 'Judul utama hero landing page'),
  ('site_subtitle', '"SMAN 5 Taruna Brawijaya Jawa Timur"', 'Sub-judul hero landing page')
ON CONFLICT (key) DO NOTHING;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_site_settings_update
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();
