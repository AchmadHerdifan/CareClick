-- ============================================
-- SQL SCHEMA - Sistem Manajemen Klinik
-- Jalankan di Supabase: SQL Editor
-- ============================================

-- 1. Tabel Pasien
CREATE TABLE IF NOT EXISTS pasien (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  nik VARCHAR(16) UNIQUE NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin CHAR(1) CHECK (jenis_kelamin IN ('L', 'P')) NOT NULL,
  alamat TEXT,
  no_telepon VARCHAR(15),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Dokter
CREATE TABLE IF NOT EXISTS dokter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  spesialisasi VARCHAR(100) NOT NULL,
  no_str VARCHAR(50) UNIQUE NOT NULL,
  jadwal JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Rekam Medis
CREATE TABLE IF NOT EXISTS rekam_medis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pasien_id UUID REFERENCES pasien(id) ON DELETE CASCADE NOT NULL,
  dokter_id UUID REFERENCES dokter(id) ON DELETE SET NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  keluhan TEXT NOT NULL,
  diagnosis TEXT,
  resep TEXT,
  catatan TEXT,
  status_resep VARCHAR(20) DEFAULT 'menunggu' CHECK (status_resep IN ('menunggu', 'diproses', 'selesai')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Obat
CREATE TABLE IF NOT EXISTS obat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_obat VARCHAR(100) NOT NULL,
  harga DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stok INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Resep Obat (Pivot rekam_medis & obat)
CREATE TABLE IF NOT EXISTS resep_obat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rekam_medis_id UUID REFERENCES rekam_medis(id) ON DELETE CASCADE NOT NULL,
  obat_id UUID REFERENCES obat(id) ON DELETE CASCADE NOT NULL,
  jumlah INT NOT NULL DEFAULT 1,
  harga_satuan DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_harga DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Antrian
CREATE TABLE IF NOT EXISTS antrian (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pasien_id UUID REFERENCES pasien(id) ON DELETE CASCADE NOT NULL,
  dokter_id UUID REFERENCES dokter(id) ON DELETE SET NULL,
  nomor_antrian INT NOT NULL,
  status VARCHAR(10) CHECK (status IN ('menunggu', 'dipanggil', 'selesai', 'batal')) DEFAULT 'menunggu',
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(dokter_id, nomor_antrian, tanggal)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE pasien ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokter ENABLE ROW LEVEL SECURITY;
ALTER TABLE rekam_medis ENABLE ROW LEVEL SECURITY;
ALTER TABLE antrian ENABLE ROW LEVEL SECURITY;
ALTER TABLE obat ENABLE ROW LEVEL SECURITY;
ALTER TABLE resep_obat ENABLE ROW LEVEL SECURITY;

-- Policy: user yang sudah login bisa baca semua data
CREATE POLICY "authenticated_read_pasien" ON pasien
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_all_pasien" ON pasien
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_read_dokter" ON dokter
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated_all_dokter" ON dokter
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all_rekam_medis" ON rekam_medis
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all_antrian" ON antrian
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all_obat" ON obat
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all_resep_obat" ON resep_obat
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- DUMMY DATA (opsional, untuk testing)
-- ============================================
INSERT INTO dokter (nama, spesialisasi, no_str, jadwal) VALUES
  ('dr. Budi Santoso', 'Umum', 'STR-001-2024', '[{"hari":"Senin","jam_mulai":"08:00","jam_selesai":"12:00"},{"hari":"Rabu","jam_mulai":"08:00","jam_selesai":"12:00"}]'),
  ('dr. Siti Rahayu', 'Gigi', 'STR-002-2024', '[{"hari":"Selasa","jam_mulai":"09:00","jam_selesai":"14:00"},{"hari":"Kamis","jam_mulai":"09:00","jam_selesai":"14:00"}]');

INSERT INTO pasien (nama, nik, tanggal_lahir, jenis_kelamin, alamat, no_telepon) VALUES
  ('Ahmad Fauzi', '3578010101900001', '1990-01-01', 'L', 'Jl. Raya Surabaya No.1', '081234567890'),
  ('Dewi Lestari', '3578010201950002', '1995-02-01', 'P', 'Jl. Pemuda No.10', '081234567891');
