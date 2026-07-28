'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function ProfilPage() {
  const supabase = createClient()
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [nik, setNik] = useState('')
  const [tanggalLahir, setTanggalLahir] = useState('')
  const [jenisKelamin, setJenisKelamin] = useState('L')
  const [noTelepon, setNoTelepon] = useState('')
  const [alamat, setAlamat] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pwMessage, setPwMessage] = useState('')
  const [pwError, setPwError] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [loadingPw, setLoadingPw] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        const { data: profile } = await supabase
          .from('profiles')
          .select('nama')
          .eq('id', user.id)
          .single()
        setNama(profile?.nama || '')

        // Fetch data medis dari tabel pasien
        const { data: pasienData } = await supabase
          .from('pasien')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (pasienData) {
          setNik(pasienData.nik || '')
          setTanggalLahir(pasienData.tanggal_lahir || '')
          setJenisKelamin(pasienData.jenis_kelamin || 'L')
          setNoTelepon(pasienData.no_telepon || '')
          setAlamat(pasienData.alamat || '')
        }
      }
      setLoadingProfile(false)
    }
    load()
  }, [])

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Sesi habis. Silakan login kembali.')
      setLoading(false)
      return
    }

    // 1. Update tabel profiles (untuk role/nama umum)
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({ nama })
      .eq('id', user.id)

    if (profileErr) {
      setError(profileErr.message)
      setLoading(false)
      return
    }

    // 2. Upsert ke tabel pasien (agar jika belum ada, data pasien terbuat secara otomatis)
    const { error: pasienErr } = await supabase
      .from('pasien')
      .upsert({
        id: user.id,
        nama,
        nik,
        tanggal_lahir: tanggalLahir || null,
        jenis_kelamin: jenisKelamin,
        alamat,
        no_telepon: noTelepon
      })

    if (pasienErr) {
      setError(pasienErr.message)
      setLoading(false)
      return
    }

    // 3. Update auth user metadata
    await supabase.auth.updateUser({ data: { nama } })

    setLoading(false)
    setMessage('Profil berhasil diperbarui!')
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwMessage('')
    setPwError('')

    if (newPassword !== confirmPassword) {
      setPwError('Password baru dan konfirmasi tidak cocok.')
      return
    }

    if (newPassword.length < 6) {
      setPwError('Password minimal 6 karakter.')
      return
    }

    setLoadingPw(true)
    const { error: err } = await supabase.auth.updateUser({
      password: newPassword,
    })
    setLoadingPw(false)

    if (err) {
      setPwError(err.message)
    } else {
      setPwMessage('Password berhasil diubah!')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  if (loadingProfile) {
    return <p className="text-gray-500 text-center py-8">Memuat...</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Profil Saya</h1>
      <p className="text-gray-500 mb-6">Kelola informasi profil dan data pasien Anda</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Informasi Profil & Medis */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Informasi Profil & Data Medis</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-3">
            <div>
              <label className="label">Email</label>
              <input className="input-field bg-gray-50 text-gray-500 cursor-not-allowed" value={email} disabled />
            </div>
            
            <div>
              <label className="label">Nama Lengkap</label>
              <input
                className="input-field"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">NIK (16 Digit)</label>
              <input
                className="input-field"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                maxLength={16}
                required
                placeholder="Masukkan NIK 16 digit Anda"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Tanggal Lahir</label>
                <input
                  type="date"
                  className="input-field"
                  value={tanggalLahir}
                  onChange={(e) => setTanggalLahir(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Jenis Kelamin</label>
                <select
                  className="input-field"
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value)}
                  required
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">No. Telepon</label>
              <input
                type="tel"
                className="input-field"
                value={noTelepon}
                onChange={(e) => setNoTelepon(e.target.value)}
                required
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div>
              <label className="label">Alamat</label>
              <textarea
                className="input-field"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                rows={3}
                required
                placeholder="Alamat lengkap"
              />
            </div>

            {message && <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">{message}</p>}
            {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50 w-full">
              {loading ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </form>
        </div>

        {/* Card Ganti Password */}
        <div className="card h-fit">
          <h2 className="font-semibold text-gray-900 mb-4">Ganti Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="label">Password Baru</label>
              <input
                type="password"
                className="input-field"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div>
              <label className="label">Konfirmasi Password</label>
              <input
                type="password"
                className="input-field"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Ulangi password baru"
              />
            </div>

            {pwMessage && <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">{pwMessage}</p>}
            {pwError && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{pwError}</p>}

            <button type="submit" disabled={loadingPw} className="btn-primary disabled:opacity-50 w-full">
              {loadingPw ? 'Menyimpan...' : 'Ubah Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
