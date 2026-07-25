export const APP_NAME = 'PPDB SMAN 5 Taruna Brawijaya'
export const APP_YEAR = new Date().getFullYear()

export const NAVBAR_LINKS = [
  { label: 'Beranda', to: '/' },
  { label: 'Informasi', to: '/#informasi' },
  { label: 'Timeline', to: '/#timeline' },
  { label: 'Persyaratan', to: '/#persyaratan' },
  { label: 'FAQ', to: '/#faq' },
]

export const ADMIN_SIDEBAR_LINKS = [
  { label: 'Dashboard', to: '/admin', icon: 'LayoutDashboard' },
  { label: 'Peserta', to: '/admin/participants', icon: 'Users' },
  { label: 'Jalur Pendaftaran', to: '/admin/paths', icon: 'Route' },
  { label: 'Jadwal Tes', to: '/admin/tests', icon: 'Calendar' },
]

export const PARTICIPANT_SIDEBAR_LINKS = [
  { label: 'Dashboard', to: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Pendaftaran', to: '/dashboard/registration', icon: 'FileText' },
]
