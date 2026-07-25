-- ============================================
-- PPDB SMAN 5 Taruna Brawijaya
-- Initial Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('admin', 'participant')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. PARTICIPANTS (central registration entity)
-- ============================================
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','submitted','waiting_verification','needs_revision','verified')),
  current_step INTEGER DEFAULT 1 CHECK (current_step BETWEEN 1 AND 4),
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- 3. BIODATA (personal data - Step 1)
-- ============================================
CREATE TABLE biodata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  nik TEXT,
  nisn TEXT,
  full_name TEXT,
  place_of_birth TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('L', 'P')),
  religion TEXT,
  address TEXT,
  phone_number TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_id)
);

-- ============================================
-- 4. PARENT_INFORMATION
-- ============================================
CREATE TABLE parent_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  father_name TEXT,
  mother_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_id)
);

-- ============================================
-- 5. SCHOOLS (school origin)
-- ============================================
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  school_name TEXT,
  npsn TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_id)
);

-- ============================================
-- 6. DOCUMENTS (uploaded files - Step 2)
-- ============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('pas_foto','kk','akta','skl_ijazah','rapor')),
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_id, doc_type)
);

-- ============================================
-- 7. GRADES (semester grades - Step 3)
-- ============================================
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  semester INTEGER NOT NULL CHECK (semester IN (3, 4, 5)),
  subject TEXT NOT NULL CHECK (subject IN ('bahasa_indonesia','bahasa_inggris','matematika','ipa')),
  score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_id, semester, subject)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_participants_user_id ON participants(user_id);
CREATE INDEX idx_participants_status ON participants(status);
CREATE INDEX idx_biodata_participant_id ON biodata(participant_id);
CREATE INDEX idx_parent_information_participant_id ON parent_information(participant_id);
CREATE INDEX idx_schools_participant_id ON schools(participant_id);
CREATE INDEX idx_documents_participant_id ON documents(participant_id);
CREATE INDEX idx_grades_participant_id ON grades(participant_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_participants_updated_at ON participants;
DROP TRIGGER IF EXISTS update_biodata_updated_at ON biodata;
DROP TRIGGER IF EXISTS update_parent_information_updated_at ON parent_information;
DROP TRIGGER IF EXISTS update_schools_updated_at ON schools;
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
DROP TRIGGER IF EXISTS update_grades_updated_at ON grades;
DROP FUNCTION IF EXISTS update_updated_at_column();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_biodata_updated_at BEFORE UPDATE ON biodata
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parent_information_updated_at BEFORE UPDATE ON parent_information
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    'participant'
  );

  -- Auto-create participant record
  INSERT INTO public.participants (user_id, status, current_step)
  VALUES (NEW.id, 'draft', 1);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-create related records when participant is created
DROP TRIGGER IF EXISTS on_participant_created ON participants;
DROP FUNCTION IF EXISTS handle_new_participant();

CREATE OR REPLACE FUNCTION handle_new_participant()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.biodata (participant_id) VALUES (NEW.id);
  INSERT INTO public.parent_information (participant_id) VALUES (NEW.id);
  INSERT INTO public.schools (participant_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_participant_created
  AFTER INSERT ON participants
  FOR EACH ROW EXECUTE FUNCTION handle_new_participant();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE biodata ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Helper function: ambil role user saat ini tanpa kena RLS loop
-- SECURITY DEFINER = berjalan sebagai pemilik DB, bypass RLS
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Drop existing policies to allow re-run
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own participant" ON participants;
DROP POLICY IF EXISTS "Users can update own participant" ON participants;
DROP POLICY IF EXISTS "Users can insert own participant" ON participants;
DROP POLICY IF EXISTS "Admins can view all participants" ON participants;
DROP POLICY IF EXISTS "Admins can update all participants" ON participants;
DROP POLICY IF EXISTS "Users can view own biodata" ON biodata;
DROP POLICY IF EXISTS "Users can update own biodata" ON biodata;
DROP POLICY IF EXISTS "Users can insert own biodata" ON biodata;
DROP POLICY IF EXISTS "Admins can view all biodata" ON biodata;
DROP POLICY IF EXISTS "Users can view own parent_information" ON parent_information;
DROP POLICY IF EXISTS "Users can update own parent_information" ON parent_information;
DROP POLICY IF EXISTS "Users can insert own parent_information" ON parent_information;
DROP POLICY IF EXISTS "Admins can view all parent_information" ON parent_information;
DROP POLICY IF EXISTS "Users can view own schools" ON schools;
DROP POLICY IF EXISTS "Users can update own schools" ON schools;
DROP POLICY IF EXISTS "Users can insert own schools" ON schools;
DROP POLICY IF EXISTS "Admins can view all schools" ON schools;
DROP POLICY IF EXISTS "Users can view own documents" ON documents;
DROP POLICY IF EXISTS "Users can update own documents" ON documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON documents;
DROP POLICY IF EXISTS "Users can view own grades" ON grades;
DROP POLICY IF EXISTS "Users can update own grades" ON grades;
DROP POLICY IF EXISTS "Users can insert own grades" ON grades;
DROP POLICY IF EXISTS "Admins can view all grades" ON grades;

-- Profiles: users can read/update their own
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Profiles: admins can view all
-- Menggunakan get_my_role() untuk menghindari infinite recursion
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (public.get_my_role() = 'admin');

-- Participants: users can view/update their own
CREATE POLICY "Users can view own participant"
  ON participants FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own participant"
  ON participants FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own participant"
  ON participants FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Participants: admins can view all
CREATE POLICY "Admins can view all participants"
  ON participants FOR SELECT
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can update all participants"
  ON participants FOR UPDATE
  USING (public.get_my_role() = 'admin');

-- Biodata: users can view/update their own
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

-- Biodata: admins can view all
CREATE POLICY "Admins can view all biodata"
  ON biodata FOR SELECT
  USING (public.get_my_role() = 'admin');

-- Parent Information: users can view/update their own
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

-- Schools: users can view/update their own
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

-- Documents: users can view/update their own
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

-- Grades: users can view/update their own
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

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage buckets (safe to re-run)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies: drop existing first
DROP POLICY IF EXISTS "Users can upload avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload document" ON storage.objects;
DROP POLICY IF EXISTS "Users can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all storage" ON storage.objects;

-- Storage policies: users can upload to their own folder
CREATE POLICY "Users can upload avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own avatar"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload document"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "Admins can view all storage"
  ON storage.objects FOR SELECT
  USING (public.get_my_role() = 'admin');
