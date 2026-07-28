-- ============================================
-- SQL UPDATE - Akses Publik untuk Poli
-- Jalankan di Supabase: SQL Editor
-- ============================================

-- Izinkan pengguna publik (anon) untuk membaca daftar poli di halaman pendaftaran
CREATE POLICY "anon_read_poli" ON poli
  FOR SELECT TO anon USING (true);
