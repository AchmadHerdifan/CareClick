# Flow Fitur KlinikApp

Dokumen ini menjelaskan alur lengkap setiap fitur untuk dua role: **User (Pasien)** dan **Admin**.

---

## BAGIAN 1 — User Pasien

### Alur Masuk

```
Buka website
    │
    ▼
Sudah punya akun?
    │
    ├── Tidak → Register (isi nama, email, password) → Login
    │
    └── Ya → Login (email + password)
                │
                ▼
        Dashboard Pasien
```

---

### Fitur 1 — Daftar Antrian

```
Dashboard Pasien
    │
    ▼
Halaman Antrian Saya
    │
    ▼
Pilih Poli
    ├── Poli Umum
    ├── Poli Gigi
    └── UGD
    │
    ▼
Pilih Dokter
    (berdasarkan poli yang dipilih)
    │
    ▼
Klik "Ambil Nomor Antrian"
    │
    ▼
Nomor antrian otomatis tersimpan
    │
    ▼
Tampil nomor antrian + status: Menunggu
```

---

### Fitur 2 — Pantau Status Antrian

```
Halaman Antrian Saya
    │
    ▼
Lihat status antrian hari ini
    │
    ▼
Status: Menunggu
    │
    ▼
Status: Dipanggil  ← (admin update)
    │
    ▼
Status: Selesai    ← (admin update)
    │
    (atau)
    │
    ▼
Status: Batal      ← (admin/pasien batalkan)
```

---

### Fitur 3 — Rekam Medis Saya

```
Dashboard Pasien
    │
    ▼
Halaman Rekam Medis Saya
    │
    ▼
Lihat daftar riwayat pemeriksaan
    │
    ▼
Klik salah satu riwayat
    │
    ▼
Detail pemeriksaan:
    ├── Tanggal
    ├── Nama dokter
    ├── Keluhan
    ├── Diagnosis
    ├── Resep
    └── Catatan dokter
```

---

### Fitur 4 — Profil Saya

```
Dashboard Pasien
    │
    ▼
Halaman Profil Saya
    │
    ├── Edit nama lengkap → Simpan
    │
    └── Ganti password
            ├── Isi password baru
            ├── Konfirmasi password baru
            └── Simpan
```

---

### Fitur 5 — Logout

```
Sidebar kiri → Klik "Keluar"
    │
    ▼
Sesi dihapus
    │
    ▼
Redirect ke halaman Login
```

---

## BAGIAN 2 — Admin

### Alur Masuk

```
Buka website → Login
    │
    ▼
Sistem cek role = admin
    │
    ▼
Dashboard Admin
    ├── Total pasien
    ├── Total dokter
    ├── Antrian menunggu hari ini
    └── Total rekam medis
```

---

### Fitur 1 — Manajemen Pasien

```
Dashboard Admin → Menu Pasien
    │
    ▼
Lihat daftar semua pasien (tabel + search)
    │
    ├── Tambah Pasien Baru
    │       ├── Isi nama, NIK, tanggal lahir
    │       ├── Isi jenis kelamin, alamat, no. telepon
    │       └── Simpan → data tersimpan ke database
    │
    ├── Edit Data Pasien
    │       ├── Klik tombol Edit pada baris pasien
    │       ├── Ubah data yang perlu diperbarui
    │       └── Simpan perubahan
    │
    └── Hapus Pasien
            ├── Klik tombol Hapus
            ├── Konfirmasi hapus
            └── Data pasien dihapus dari database
```

---

### Fitur 2 — Manajemen Dokter

```
Dashboard Admin → Menu Dokter
    │
    ▼
Lihat daftar semua dokter (nama, spesialisasi, poli, jadwal)
    │
    ├── Tambah Dokter Baru
    │       ├── Isi nama, spesialisasi, No. STR
    │       ├── Pilih poli
    │       ├── Atur jadwal (hari + jam mulai + jam selesai)
    │       └── Simpan
    │
    ├── Edit Data Dokter
    │       ├── Ubah data atau jadwal
    │       └── Simpan perubahan
    │
    └── Hapus Dokter
            ├── Konfirmasi hapus
            └── Data dokter dihapus
```

---

### Fitur 3 — Manajemen Poli

```
Dashboard Admin → Menu Poli
    │
    ▼
Lihat daftar poli (Umum, Gigi, UGD)
    │
    ├── Tambah Poli Baru
    │       ├── Isi nama poli
    │       ├── Isi keterangan
    │       └── Simpan
    │
    ├── Edit Poli
    │       └── Ubah nama / keterangan → Simpan
    │
    └── Hapus Poli
            └── Konfirmasi → Hapus
```

---

### Fitur 4 — Rekam Medis

```
Dashboard Admin → Menu Rekam Medis
    │
    ▼
Lihat semua rekam medis (seluruh pasien)
    │
    ├── Filter data
    │       ├── Filter berdasarkan nama pasien
    │       ├── Filter berdasarkan dokter
    │       └── Filter berdasarkan tanggal
    │
    ├── Input Rekam Medis Baru
    │       ├── Pilih pasien
    │       ├── Pilih dokter
    │       ├── Isi tanggal pemeriksaan
    │       ├── Isi keluhan pasien
    │       ├── Isi diagnosis
    │       ├── Isi resep
    │       ├── Isi catatan (opsional)
    │       └── Simpan
    │
    ├── Lihat Detail Rekam Medis
    │       └── Klik baris → tampil detail lengkap
    │
    └── Hapus Rekam Medis
            └── Konfirmasi → Hapus
```

---

### Fitur 5 — Kelola Antrian

```
Dashboard Admin → Menu Antrian
    │
    ▼
Lihat antrian hari ini (semua poli)
    │
    ├── Tambah Antrian Manual
    │       ├── Pilih pasien
    │       ├── Pilih poli
    │       ├── Pilih dokter
    │       └── Simpan → nomor antrian otomatis
    │
    ├── Update Status Antrian
    │       ├── Klik "Panggil"  → status: Dipanggil
    │       ├── Klik "Selesai"  → status: Selesai
    │       └── Klik "Batal"    → status: Batal
    │
    └── Antrian reset otomatis setiap hari baru
```

---

### Fitur 6 — Pengaturan

```
Dashboard Admin → Menu Pengaturan
    │
    ├── Ubah Password
    │       ├── Isi password lama
    │       ├── Isi password baru
    │       ├── Konfirmasi password baru
    │       └── Simpan
    │
    ├── Lihat Info Sistem
    │       ├── Nama aplikasi
    │       ├── Versi
    │       ├── Status koneksi database
    │       └── Role aktif
    │
    └── Logout
            └── Redirect ke halaman Login
```

---

## Ringkasan Perbedaan Alur

| Fitur | User Pasien | Admin |
|---|---|---|
| Register | ✅ Wajib pertama kali | ❌ Tidak perlu |
| Lihat data pasien lain | ❌ | ✅ |
| Tambah / edit / hapus pasien | ❌ | ✅ |
| Input rekam medis | ❌ | ✅ |
| Lihat rekam medis sendiri | ✅ | ✅ |
| Daftar antrian | ✅ | ✅ (manual) |
| Update status antrian | ❌ | ✅ |
| Kelola dokter & poli | ❌ | ✅ |
| Ganti password | ✅ | ✅ |
| Lihat info sistem | ❌ | ✅ |
