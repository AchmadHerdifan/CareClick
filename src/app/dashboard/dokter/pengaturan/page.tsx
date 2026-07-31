'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function PengaturanDokterPage() {
  const supabase = createClient()
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [spesialisasi, setSpesialisasi] = useState('')
  const [noStr, setNoStr] = useState('')

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

        // Fetch data dokter
        const { data: dokterData } = await supabase
          .from('dokter')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (dokterData) {
          setSpesialisasi(dokterData.spesialisasi || '')
          setNoStr(dokterData.no_str || '')
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

    // 1. Update tabel profiles
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({ nama })
      .eq('id', user.id)

    if (profileErr) {
      setError(profileErr.message)
      setLoading(false)
      return
    }

    // 2. Upsert ke tabel dokter
    const { error: dokterErr } = await supabase
      .from('dokter')
      .upsert({
        id: user.id,
        nama,
        spesialisasi,
        no_str: noStr,
      })

    if (dokterErr) {
      setError(dokterErr.message)
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
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Akun Saya</h1>
      <p className="text-gray-500 mb-6">Kelola informasi profil dan kredensial akun dokter Anda</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Informasi Profil */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Informasi Profil Dokter</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-3">
            <div>
              <label className="label">Email</label>
              <input className="input-field bg-gray-50 text-gray-500 cursor-not-allowed" value={email} disabled />
            </div>
            
            <div>
              <label className="label">Nama Lengkap (beserta gelar)</label>
              <input
                className="input-field"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                placeholder="dr. Budi Santoso"
              />
            </div>

            <div>
              <label className="label">Spesialisasi</label>
              <input
                className="input-field"
                value={spesialisasi}
                onChange={(e) => setSpesialisasi(e.target.value)}
                required
                placeholder="Umum, Gigi, Anak, dll."
              />
            </div>

            <div>
              <label className="label">No. STR</label>
              <input
                className="input-field"
                value={noStr}
                onChange={(e) => setNoStr(e.target.value)}
                required
                placeholder="Masukkan Nomor STR Anda"
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
