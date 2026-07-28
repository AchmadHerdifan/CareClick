# 🏥 Sistem Manajemen Klinik

Aplikasi web untuk mengatur jadwal pasien, data rekam medis, dan antrian pemeriksaan.

## Tech Stack
- **Next.js 14** (App Router + TypeScript)
- **Tailwind CSS** (styling)
- **Supabase** (database PostgreSQL + Auth)
- **Vercel** (deployment)

---

## 🚀 Langkah Setup (Urutan Wajib)

### Step 1 — Buat Project Supabase
1. Buka https://supabase.com → Login → "New Project"
2. Isi nama project: `sistem-klinik`
3. Set password database (simpan!)
4. Tunggu sampai project siap (~1 menit)

### Step 2 — Jalankan SQL Schema
1. Di Supabase → klik **SQL Editor**
2. Copy seluruh isi file `supabase-schema.sql`
3. Paste → klik **Run**
4. Pastikan tidak ada error merah

### Step 3 — Ambil API Keys
1. Di Supabase → **Settings** → **API**
2. Copy:
   - `Project URL` → untuk `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4 — Setup Project Lokal
```bash
# Clone / copy folder ini, lalu:
npm install

# Buat file .env.local (dari template)
cp .env.local.example .env.local

# Edit .env.local, isi dengan key dari Supabase
```

### Step 5 — Jalankan Development Server
```bash
npm run dev
```
Buka http://localhost:3000

---

## 📁 Struktur Folder

```
src/
├── app/
│   ├── auth/
│   │   ├── login/        → Halaman login
│   │   └── register/     → Halaman daftar
│   ├── dashboard/
│   │   ├── page.tsx      → Dashboard utama (statistik)
│   │   ├── pasien/       → CRUD data pasien
│   │   ├── dokter/       → CRUD data dokter
│   │   ├── rekam-medis/  → CRUD rekam medis
│   │   └── antrian/      → Sistem antrian
│   └── layout.tsx        → Root layout
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx   → Navigasi sidebar
│   ├── ui/               → Button, Input, Badge, dll
│   ├── forms/            → Form pasien, dokter, dll
│   └── tables/           → Tabel data
├── lib/
│   ├── supabase.ts       → Supabase client (browser)
│   └── supabase-server.ts → Supabase client (server)
├── types/
│   └── index.ts          → TypeScript types semua entity
└── middleware.ts          → Proteksi route (Auth guard)
```

---

## 🔐 Fitur Auth
- Register & Login via email/password
- Session otomatis tersimpan di cookie
- Route `/dashboard/*` terlindungi (redirect ke login kalau belum login)
- Route `/auth/*` redirect ke dashboard kalau sudah login

---

## 📋 Pengembangan Selanjutnya

Halaman yang masih perlu dibuat:
- [ ] `dashboard/pasien` → Tabel + form CRUD pasien
- [ ] `dashboard/dokter` → Tabel + form CRUD dokter
- [ ] `dashboard/rekam-medis` → Tabel + form + filter
- [ ] `dashboard/antrian` → Sistem nomor antrian + update status realtime

---

## 🚢 Deploy ke Vercel
```bash
npm i -g vercel
vercel
```
Tambahkan environment variables di Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
