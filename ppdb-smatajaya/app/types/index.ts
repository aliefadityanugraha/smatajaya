export type UserRole = 'admin' | 'participant'

export type ParticipantStatus =
  | 'draft'
  | 'submitted'
  | 'waiting_verification'
  | 'needs_revision'
  | 'verified'
  | 'accepted'

export type FinalStatus = 'pending' | 'lulus' | 'tidak_lulus'

export type DocumentType =
  | 'pas_foto'
  | 'kk'
  | 'skl_ijazah'
  | 'sertifikat_prestasi'
  | 'surat_keterangan_sehat'
  | 'surat_kelakuan_baik'

export type Gender = 'L' | 'P'

export type Semester = 1 | 2 | 3 | 4

export type Subject =
  | 'bahasa_indonesia'
  | 'bahasa_inggris'
  | 'ppkn'
  | 'matematika'
  | 'ipa'
  | 'ips'

export const REGISTRATION_STEPS = [
  { id: 1, key: 'biodata', label: 'Biodata', icon: 'User' },
  { id: 2, key: 'documents', label: 'Dokumen', icon: 'FileText' },
  { id: 3, key: 'grades', label: 'Nilai', icon: 'GraduationCap' },
  { id: 4, key: 'review', label: 'Review', icon: 'CheckCircle' },
] as const

export const PATH_SLUGS = ['umum', 'beasiswa', 'beasiswa_yatim_piatu'] as const
export type PathSlug = typeof PATH_SLUGS[number]

export const PATH_DOCUMENTS: Record<PathSlug, string[]> = {
  umum: [],
  beasiswa: ['surat_penghasilan'],
  beasiswa_yatim_piatu: ['surat_penghasilan', 'surat_kematian', 'surat_keterangan_yatim'],
}

export const PATH_DOCUMENT_LABELS: Record<string, string> = {
  surat_penghasilan: 'Surat Keterangan Penghasilan / Tidak Mampu',
  surat_kematian: 'Surat Kematian Orang Tua',
  surat_keterangan_yatim: 'Surat Keterangan Yatim dari Kelurahan',
}

export const STATUS_CONFIG: Record<ParticipantStatus, { label: string; color: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', variant: 'secondary' },
  submitted: { label: 'Menunggu Verifikasi', color: 'bg-yellow-100 text-yellow-700', variant: 'outline' },
  waiting_verification: { label: 'Menunggu Verifikasi', color: 'bg-yellow-100 text-yellow-700', variant: 'outline' },
  needs_revision: { label: 'Perlu Revisi', color: 'bg-red-100 text-red-700', variant: 'destructive' },
  verified: { label: 'Terverifikasi', color: 'bg-green-100 text-green-700', variant: 'default' },
  accepted: { label: 'Diterima (Fase Tes)', color: 'bg-blue-100 text-blue-700', variant: 'default' },
}

export const FINAL_STATUS_CONFIG: Record<FinalStatus, { label: string; color: string }> = {
  pending: { label: 'Menunggu Keputusan', color: 'bg-gray-100 text-gray-700' },
  lulus: { label: 'Lulus', color: 'bg-green-100 text-green-700' },
  tidak_lulus: { label: 'Tidak Lulus', color: 'bg-red-100 text-red-700' },
}

export const TEST_NAMES: Record<number, string> = {
  1: 'Tes Kesehatan Jiwa & Kesehatan Umum',
  2: 'Tes Akademik',
  3: 'Tes Psikologi',
  4: 'Tes Kesegaran Jasmani',
  5: 'Tes Wawancara',
  6: 'Tes Pantukhir',
}

export const GENDER_OPTIONS = [
  { value: 'L', label: 'Laki-laki' },
  { value: 'P', label: 'Perempuan' },
]

export const RELIGION_OPTIONS = [
  'Islam',
  'Kristen',
  'Katolik',
  'Hindu',
  'Buddha',
  'Konghucu',
]

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  pas_foto: 'Foto 4x6',
  kk: 'Kartu Keluarga',
  skl_ijazah: 'Ijazah',
  sertifikat_prestasi: 'Sertifikat / Piagam Penghargaan',
  surat_keterangan_sehat: 'Surat Keterangan Sehat dari Dokter',
  surat_kelakuan_baik: 'Surat Kelakuan Baik (SKB) dari Sekolah',
}

export const ALL_DOCUMENT_LABELS: Record<string, string> = {
  ...DOCUMENT_LABELS,
  ...PATH_DOCUMENT_LABELS,
}

export const OPTIONAL_DOCUMENTS: string[] = ['sertifikat_prestasi']

export const ORPHAN_STATUS_LABELS: Record<string, string> = {
  yatim: 'Yatim (Ayah meninggal)',
  piatu: 'Piatu (Ibu meninggal)',
  yatim_piatu: 'Yatim Piatu (Kedua orang tua meninggal)',
}

export const SUBJECT_LABELS: Record<Subject, string> = {
  bahasa_indonesia: 'Bahasa Indonesia',
  bahasa_inggris: 'Bahasa Inggris',
  ppkn: 'PPKn',
  matematika: 'Matematika',
  ipa: 'IPA',
  ips: 'IPS',
}
