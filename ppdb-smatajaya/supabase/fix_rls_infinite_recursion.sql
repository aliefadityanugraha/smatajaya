-- ============================================
-- FIX: Infinite Recursion pada RLS Policy profiles
-- Jalankan SQL ini di Supabase Dashboard > SQL Editor
-- ============================================

-- STEP 1: Buat helper function yang bypass RLS
-- SECURITY DEFINER = fungsi berjalan sebagai pemilik DB, bukan user biasa
-- Sehingga tidak terkena RLS loop
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- STEP 2: Drop policy lama yang menyebabkan infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;


-- STEP 3: Buat ulang policy dengan helper function (bukan query langsung ke profiles)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (public.get_my_role() = 'admin');


-- STEP 4: Update semua policy admin lainnya (opsional tapi disarankan untuk konsistensi)
-- Participants
DROP POLICY IF EXISTS "Admins can view all participants" ON participants;
DROP POLICY IF EXISTS "Admins can update all participants" ON participants;

CREATE POLICY "Admins can view all participants"
  ON participants FOR SELECT
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can update all participants"
  ON participants FOR UPDATE
  USING (public.get_my_role() = 'admin');

-- Biodata
DROP POLICY IF EXISTS "Admins can view all biodata" ON biodata;

CREATE POLICY "Admins can view all biodata"
  ON biodata FOR SELECT
  USING (public.get_my_role() = 'admin');

-- Parent Information
DROP POLICY IF EXISTS "Admins can view all parent_information" ON parent_information;

CREATE POLICY "Admins can view all parent_information"
  ON parent_information FOR SELECT
  USING (public.get_my_role() = 'admin');

-- Schools
DROP POLICY IF EXISTS "Admins can view all schools" ON schools;

CREATE POLICY "Admins can view all schools"
  ON schools FOR SELECT
  USING (public.get_my_role() = 'admin');

-- Documents
DROP POLICY IF EXISTS "Admins can view all documents" ON documents;

CREATE POLICY "Admins can view all documents"
  ON documents FOR SELECT
  USING (public.get_my_role() = 'admin');

-- Grades
DROP POLICY IF EXISTS "Admins can view all grades" ON grades;

CREATE POLICY "Admins can view all grades"
  ON grades FOR SELECT
  USING (public.get_my_role() = 'admin');

-- Storage
DROP POLICY IF EXISTS "Admins can view all storage" ON storage.objects;

CREATE POLICY "Admins can view all storage"
  ON storage.objects FOR SELECT
  USING (public.get_my_role() = 'admin');


-- STEP 5: Verifikasi - cek apakah function bisa dipanggil
-- (Harusnya return role kamu jika sudah login)
SELECT public.get_my_role();
