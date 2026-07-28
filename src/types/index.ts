// ============================================
// TIPE DATA SISTEM MANAJEMEN KLINIK
// ============================================

export type Role = 'admin' | 'user' | 'dokter' | 'apoteker'

export type StatusAntrian = 'menunggu' | 'dipanggil' | 'selesai' | 'batal'

export type StatusResep = 'menunggu' | 'diproses' | 'selesai'

// User profile dari tabel profiles
export interface UserProfile {
  id: string
  nama: string
  role: Role
  created_at: string
}

// Data Poli
export interface Poli {
  id: string
  nama: string
  keterangan: string
  created_at: string
}

// Data Pasien
export interface Pasien {
  id: string
  nama: string
  nik: string
  tanggal_lahir: string
  jenis_kelamin: 'L' | 'P'
  alamat: string
  no_telepon: string
  created_at: string
}

// Data Dokter
export interface Dokter {
  id: string
  nama: string
  spesialisasi: string
  no_str: string
  jadwal: JadwalDokter[]
  poli_id: string | null
  // Joined
  poli?: Poli
  created_at: string
}

export interface JadwalDokter {
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu'
  jam_mulai: string
  jam_selesai: string
}

// Data Obat
export interface Obat {
  id: string
  nama_obat: string
  harga: number
  stok: number
  created_at: string
}

// Rekam Medis
export interface RekamMedis {
  id: string
  pasien_id: string
  dokter_id: string
  tanggal: string
  keluhan: string
  diagnosis: string
  resep: string
  catatan?: string
  status_resep: StatusResep
  pasien?: Pasien
  dokter?: Dokter
  created_at: string
}

// Resep Obat
export interface ResepObat {
  id: string
  rekam_medis_id: string
  obat_id: string
  jumlah: number
  harga_satuan: number
  total_harga: number
  obat?: Obat
  created_at: string
}

// Antrian
export interface Antrian {
  id: string
  pasien_id: string
  dokter_id: string
  poli_id: string | null
  nomor_antrian: number
  status: StatusAntrian
  tanggal: string
  pasien?: Pasien
  dokter?: Dokter
  poli?: Poli
  created_at: string
}

// Form types
export type PasienForm = Omit<Pasien, 'id' | 'created_at'>
export type DokterForm = Omit<Dokter, 'id' | 'created_at' | 'poli'>
export type RekamMedisForm = Omit<RekamMedis, 'id' | 'created_at' | 'pasien' | 'dokter' | 'status_resep'>
export type AntrianForm = Omit<Antrian, 'id' | 'created_at' | 'pasien' | 'dokter' | 'poli'>
export type PoliForm = Omit<Poli, 'id' | 'created_at'>
export type ObatForm = Omit<Obat, 'id' | 'created_at'>
export type ResepObatForm = Omit<ResepObat, 'id' | 'created_at' | 'obat'>
