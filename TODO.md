# TODO - Landing Page Klinik App

## Step 1: Implement landing page
- Ubah `src/app/page.tsx` dari redirect ke `/dashboard` menjadi landing page.
- Tambahkan hero, ringkasan fitur, tombol CTA (Masuk ke `/auth/login`, Daftar ke `/auth/register`), dan footer.
- Pastikan styling memakai kelas Tailwind dan utility yang ada (`card`, `btn-primary`, dll).

## Step 2: Verifikasi
- Jalankan `npm run dev`.
- Buka `/` untuk memastikan landing tampil.
- Klik CTA menuju halaman auth.
- Login lalu verifikasi `/dashboard` tetap protected oleh middleware.

