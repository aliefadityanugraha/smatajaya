export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  role: 'admin' | 'participant'
  created_at: string
  updated_at: string
}

export interface RegistrationPath {
  id: string
  name: string
  slug: string
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Participant {
  id: string
  user_id: string
  status: 'draft' | 'submitted' | 'waiting_verification' | 'needs_revision' | 'verified' | 'accepted'
  current_step: number
  registration_path_id: string | null
  parent_income: string | null
  parent_occupation_father: string | null
  parent_occupation_mother: string | null
  dependents_count: number | null
  achievements: string | null
  orphan_status: 'yatim' | 'piatu' | 'yatim_piatu' | null
  guardian_name: string | null
  guardian_relation: string | null
  admin_notes: string | null
  submitted_at: string | null
  verified_at: string | null
  final_status: 'pending' | 'lulus' | 'tidak_lulus'
  admin_decision_at: string | null
  announcement_date: string | null
  announcement_revealed: boolean
  created_at: string
  updated_at: string
}

export interface TestSchedule {
  id: string
  test_number: number
  name: string
  date: string
  time: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface Biodata {
  id: string
  participant_id: string
  nik: string | null
  nisn: string | null
  full_name: string | null
  place_of_birth: string | null
  date_of_birth: string | null
  gender: 'L' | 'P' | null
  religion: string | null
  address: string | null
  phone_number: string | null
  photo_url: string | null
  created_at: string
  updated_at: string
}

export interface ParentInformation {
  id: string
  participant_id: string
  father_name: string | null
  mother_name: string | null
  created_at: string
  updated_at: string
}

export interface School {
  id: string
  participant_id: string
  school_name: string | null
  npsn: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  participant_id: string
  doc_type:
    | 'pas_foto' | 'kk' | 'skl_ijazah' | 'sertifikat_prestasi'
    | 'surat_keterangan_sehat' | 'surat_kelakuan_baik'
    | 'surat_penghasilan' | 'surat_kematian' | 'surat_keterangan_yatim'
  file_url: string | null
  file_name: string | null
  created_at: string
  updated_at: string
}

export interface Grade {
  id: string
  participant_id: string
  semester: 1 | 2 | 3 | 4
  subject: 'bahasa_indonesia' | 'bahasa_inggris' | 'ppkn' | 'matematika' | 'ipa' | 'ips'
  score: number | null
  created_at: string
  updated_at: string
}

export interface RegistrationData {
  participant: Participant
  biodata: Biodata | null
  parents: ParentInformation | null
  school: School | null
  documents: Document[]
  grades: Grade[]
}
