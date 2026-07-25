-- ============================================
-- 004: Update document types & grades schema
-- ============================================

-- 1. Delete old document types that are no longer valid
DELETE FROM documents WHERE doc_type IN ('akta', 'rapor');

-- 2. Documents: remove akta/rapor, add surat_keterangan_sehat/surat_kelakuan_baik
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_doc_type_check;

ALTER TABLE documents
  ADD CONSTRAINT documents_doc_type_check CHECK (
    doc_type IN (
      'pas_foto', 'kk', 'skl_ijazah', 'sertifikat_prestasi',
      'surat_keterangan_sehat', 'surat_kelakuan_baik',
      'surat_penghasilan', 'surat_kematian', 'surat_keterangan_yatim'
    )
  );

-- 3. Grades: delete old data before changing constraints
DELETE FROM grades WHERE semester IN (3, 4, 5);

-- 4. Grades: update subject constraint to include ppkn and ips
ALTER TABLE grades DROP CONSTRAINT IF EXISTS grades_subject_check;

ALTER TABLE grades
  ADD CONSTRAINT grades_subject_check CHECK (
    subject IN ('bahasa_indonesia', 'bahasa_inggris', 'ppkn', 'matematika', 'ipa', 'ips')
  );

-- 5. Grades: update semester constraint to 1-4
ALTER TABLE grades DROP CONSTRAINT IF EXISTS grades_semester_check;

ALTER TABLE grades
  ADD CONSTRAINT grades_semester_check CHECK (semester IN (1, 2, 3, 4));
