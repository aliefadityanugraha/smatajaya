-- ============================================
-- FIX: Storage upload RLS policy
-- ============================================

-- 1. Drop semua policy lama di storage.objects
DROP POLICY IF EXISTS "Users can upload document" ON storage.objects;
DROP POLICY IF EXISTS "Users can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all storage" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own avatar" ON storage.objects;

-- 2. Buat helper function (bypass RLS participants)
CREATE OR REPLACE FUNCTION public.get_user_participant_ids()
RETURNS SETOF uuid AS $$
  SELECT id FROM participants WHERE user_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Policy upload: authenticated user bisa upload ke folder participant sendiri
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
  );

-- 4. Policy view: semua orang bisa lihat file documents (bucket public)
CREATE POLICY "Anyone can view documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

-- 5. Policy view storage admin
CREATE POLICY "Admins can view all storage"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (public.get_my_role() = 'admin');
