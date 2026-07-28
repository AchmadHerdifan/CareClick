-- ============================================
-- SQL UPDATE - Sistem Manajemen Klinik
-- Jalankan di Supabase: SQL Editor
-- untuk mengupdate database yang sudah ada
-- ============================================

-- 1. Tambah kolom status_resep di tabel rekam_medis
ALTER TABLE rekam_medis ADD COLUMN IF NOT EXISTS status_resep VARCHAR(20) DEFAULT 'menunggu' CHECK (status_resep IN ('menunggu', 'diproses', 'selesai'));

-- 2. Tabel Obat
CREATE TABLE IF NOT EXISTS obat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_obat VARCHAR(100) NOT NULL,
  harga DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stok INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Resep Obat (Pivot rekam_medis & obat)
CREATE TABLE IF NOT EXISTS resep_obat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rekam_medis_id UUID REFERENCES rekam_medis(id) ON DELETE CASCADE NOT NULL,
  obat_id UUID REFERENCES obat(id) ON DELETE CASCADE NOT NULL,
  jumlah INT NOT NULL DEFAULT 1,
  harga_satuan DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_harga DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE obat ENABLE ROW LEVEL SECURITY;
ALTER TABLE resep_obat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_all_obat" ON obat
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all_resep_obat" ON resep_obat
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- DUMMY DATA OBAT
-- ============================================
INSERT INTO obat (nama_obat, harga, stok) VALUES
  ('Paracetamol 500mg', 5000, 100),
  ('Amoxicillin 500mg', 10000, 50),
  ('Vitamin C 500mg', 7500, 200),
  ('Obat Batuk Sirup', 25000, 30);
