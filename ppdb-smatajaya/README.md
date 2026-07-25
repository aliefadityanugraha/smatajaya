# PPDB SMAN 5 Taruna Brawijaya

Aplikasi Penerimaan Peserta Didik Baru (PPDB) untuk SMAN 5 Taruna Brawijaya Jawa Timur. Proyek ini dibangun menggunakan [Nuxt](https://nuxt.com/) (Vue 3), [Supabase](https://supabase.com/) sebagai backend (database, auth, dan storage), [Pinia](https://pinia.vuejs.org/) untuk manajemen state, dan [Tailwind CSS](https://tailwindcss.com/) untuk styling.

## Fitur Utama

### 1. Pendaftaran Peserta (Dashboard Siswa)
Dashboard terintegrasi untuk calon peserta didik dalam melakukan proses pendaftaran secara mandiri:
- **Manajemen Jalur:** Pemilihan jalur pendaftaran yang tersedia secara real-time.
- **Pengisian Biodata:** Formulir terstruktur untuk data diri, informasi orang tua, dan asal sekolah.
- **Dokumen Elektronik:** Unggah dokumen persyaratan langsung ke Supabase Storage.
- **Manajemen Nilai Raport:** Input nilai akademik per semester untuk keperluan seleksi.
- **Finalisasi:** Peninjauan (review) data secara keseluruhan sebelum pengajuan resmi (submit).
- **Status Seleksi:** Pemantauan status pendaftaran, pengumuman, dan jadwal tes seleksi.

### 2. Admin Panel
Portal khusus untuk pihak sekolah dalam mengelola sistem PPDB:
- **Dashboard Admin:** Ringkasan statistik pendaftar.
- **Manajemen Peserta:** Melihat detail pendaftar, memverifikasi dokumen, dan memberikan keputusan seleksi.
- **Manajemen Alur/Jalur:** Mengatur konfigurasi jalur pendaftaran yang dibuka.
- **Manajemen Jadwal Tes:** Mengelola data dan jadwal tes seleksi bagi peserta yang lolos tahap awal.

### 3. Sistem Autentikasi
Sistem autentikasi aman menggunakan Supabase Auth yang membedakan akses antara calon pendaftar (peserta) dan administrator.

### 4. Landing Page
Halaman publik yang informatif mencakup:
- Informasi PPDB SMAN 5 Taruna Brawijaya.
- Timeline pendaftaran dan seleksi.
- Persyaratan dokumen dan kriteria kelulusan.
- FAQ untuk membantu pertanyaan umum calon pendaftar.

## Alur Pendaftaran (Workflow)

1. **Registrasi/Login:** Calon pendaftar membuat akun atau login melalui Supabase Auth.
2. **Dashboard Pendaftar:**
   - **Langkah 1 (Jalur):** Memilih jalur pendaftaran.
   - **Langkah 2 (Biodata):** Mengisi formulir data diri, orang tua, dan asal sekolah (diolah via `registration` store).
   - **Langkah 3 (Dokumen):** Mengunggah dokumen persyaratan.
   - **Langkah 4 (Nilai):** Menginput nilai raport per semester.
   - **Langkah 5 (Review):** Peninjauan dan finalisasi data.
3. **Submit:** Pendaftar melakukan submit data. Admin akan melakukan verifikasi/keputusan di sisi backend.
4. **Tahap Seleksi:** Peserta yang diterima (status `accepted`) dapat melihat jadwal tes seleksi di dashboard.

---

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
