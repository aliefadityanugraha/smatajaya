-- ============================================
-- 003: Fix documents CHECK constraint + RLS
-- ============================================

-- 1. Update documents CHECK constraint to include path-specific doc types
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_doc_type_check;

ALTER TABLE documents
  ADD CONSTRAINT documents_doc_type_check CHECK (
    doc_type IN (
      'pas_foto', 'kk', 'akta', 'skl_ijazah', 'rapor',
      'surat_penghasilan', 'sertifikat_prestasi',
      'surat_kematian', 'surat_keterangan_yatim'
    )
  );

-- 2. RLS policies

-- BIODATA
DROP POLICY IF EXISTS "Users can view own biodata" ON biodata;
DROP POLICY IF EXISTS "Users can update own biodata" ON biodata;
DROP POLICY IF EXISTS "Users can insert own biodata" ON biodata;
DROP POLICY IF EXISTS "Admins can view all biodata" ON biodata;
DROP POLICY IF EXISTS "Admins can manage all biodata" ON biodata;

CREATE POLICY "Users can view own biodata"
  ON biodata FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM participants WHERE id = biodata.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update own biodata"
  ON biodata FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM participants WHERE id = biodata.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert own biodata"
  ON biodata FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM participants WHERE id = biodata.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can view all biodata"
  ON biodata FOR SELECT
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can manage all biodata"
  ON biodata FOR ALL
  USING (public.get_my_role() = 'admin');

-- PARENT_INFORMATION
DROP POLICY IF EXISTS "Users can view own parent_information" ON parent_information;
DROP POLICY IF EXISTS "Users can update own parent_information" ON parent_information;
DROP POLICY IF EXISTS "Users can insert own parent_information" ON parent_information;
DROP POLICY IF EXISTS "Admins can view all parent_information" ON parent_information;
DROP POLICY IF EXISTS "Admins can manage all parent_information" ON parent_information;

CREATE POLICY "Users can view own parent_information"
  ON parent_information FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM participants WHERE id = parent_information.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update own parent_information"
  ON parent_information FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM participants WHERE id = parent_information.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert own parent_information"
  ON parent_information FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM participants WHERE id = parent_information.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can view all parent_information"
  ON parent_information FOR SELECT
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can manage all parent_information"
  ON parent_information FOR ALL
  USING (public.get_my_role() = 'admin');

-- SCHOOLS
DROP POLICY IF EXISTS "Users can view own schools" ON schools;
DROP POLICY IF EXISTS "Users can update own schools" ON schools;
DROP POLICY IF EXISTS "Users can insert own schools" ON schools;
DROP POLICY IF EXISTS "Admins can view all schools" ON schools;
DROP POLICY IF EXISTS "Admins can manage all schools" ON schools;

CREATE POLICY "Users can view own schools"
  ON schools FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM participants WHERE id = schools.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update own schools"
  ON schools FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM participants WHERE id = schools.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert own schools"
  ON schools FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM participants WHERE id = schools.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can view all schools"
  ON schools FOR SELECT
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can manage all schools"
  ON schools FOR ALL
  USING (public.get_my_role() = 'admin');

-- DOCUMENTS
DROP POLICY IF EXISTS "Users can view own documents" ON documents;
DROP POLICY IF EXISTS "Users can update own documents" ON documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON documents;
DROP POLICY IF EXISTS "Admins can manage all documents" ON documents;

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM participants WHERE id = documents.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM participants WHERE id = documents.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM participants WHERE id = documents.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can view all documents"
  ON documents FOR SELECT
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can manage all documents"
  ON documents FOR ALL
  USING (public.get_my_role() = 'admin');

-- GRADES
DROP POLICY IF EXISTS "Users can view own grades" ON grades;
DROP POLICY IF EXISTS "Users can update own grades" ON grades;
DROP POLICY IF EXISTS "Users can insert own grades" ON grades;
DROP POLICY IF EXISTS "Admins can view all grades" ON grades;
DROP POLICY IF EXISTS "Admins can manage all grades" ON grades;

CREATE POLICY "Users can view own grades"
  ON grades FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM participants WHERE id = grades.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update own grades"
  ON grades FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM participants WHERE id = grades.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can insert own grades"
  ON grades FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM participants WHERE id = grades.participant_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can view all grades"
  ON grades FOR SELECT
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can manage all grades"
  ON grades FOR ALL
  USING (public.get_my_role() = 'admin');
