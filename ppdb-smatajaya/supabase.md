Berikut langkah detail setup Supabase:

1. Buat Project Supabase
1. Buka https://supabase.com/dashboard
1. Klik "New Project"
1. Isi:

- Organization: pilih atau buat baru
- Project name: ppdb-smatajaya
- Database Password: buat password yang kuat (simpan!)
- Region: Southeast Asia (Singapore)

4. Klik "Create new project"
5. Tunggu ~2 menit hingga project selesai dibuat
6. Ambil Credentials
7. Di Supabase Dashboard, klik gear icon (Settings) → API
8. Copy 2 values ini:

- Project URL → contoh: https://xxxxx.supabase.co
- anon/public key → string panjang yang dimulai eyJ...

3. Buka file .env di project:
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
4. Jalankan Database Migration
5. Di Supabase Dashboard, klik "SQL Editor" di sidebar kiri
6. Klik "New query"
7. Buka file supabase/migrations/001_initial_schema.sql dari project
8. Copy seluruh isi file → paste ke SQL Editor
9. Klik "Run" (tombol biru di pojok kanan bawah)
10. Tunggu hingga muncul success message
    Ini akan membuat:

- 7 tabel (profiles, participants, biodata, parent_information, schools, documents, grades)
- Indexes untuk performa
- Triggers (auto-update updated_at, auto-create profile, auto-create biodata)
- Row Level Security policies
- Storage buckets

4. Buat Storage Buckets
   Migration SQL sudah membuat buckets, tapi verifikasi:
1. Klik "Storage" di sidebar
1. Pastikan ada 2 buckets:

- avatars (public)
- documents (public)
  Jika belum ada, buat manual:
- Klik "New bucket"
- Name: avatars, Public: ON
- Ulangi untuk documents

5. Buat Akun Admin
   Karena admin harus dibuat manual (bukan lewat register):
   Cara A: Via Supabase Dashboard
1. Klik "Authentication" → "Users"
1. Klik "Add user"
1. Pilih "Create new user"
1. Isi:

- Email: admin@smatajaya.sch.id
- Password: buat password
- Auto Confirm: ✅ centang

5. Klik "Create user"
   Cara B: Via SQL (optional, untuk set role admin)
   Setelah akun admin dibuat di atas, jalankan di SQL Editor:
   UPDATE profiles
   SET role = 'admin'
   WHERE id = (
   SELECT id FROM auth.users
   WHERE email = 'admin@smatajaya.sch.id'
   );
6. Run Development Server
   cd "E:\Project App\website smatajaya\ppdb-smatajaya"
   npm run dev
   Buka http://localhost:3000
7. Test Alur
   Test Peserta:
8. Buka /register → daftar dengan email biasa
9. Login → masuk ke Dashboard
10. Klik "Mulai Pendaftaran" → isi Biodata (autosave jalan)
11. Next → Upload Dokumen
12. Next → Input Nilai
13. Next → Review → "Kirim Pendaftaran"
14. Status berubah jadi "Menunggu Verifikasi"
    Test Admin:
15. Login dengan akun admin
16. Masuk ke /admin → lihat daftar peserta
17. Klik "Detail" → lihat data
18. Klik "Terima" atau "Revisi"
19. Jika revisi → tulis catatan
20. Cek dashboard peserta → catatan muncul
    Semua sudah siap. Tinggal isi .env dan jalankan migration SQL-nya.

UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@smatajaya.sch.id';
