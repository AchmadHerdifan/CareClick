'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function PengaturanPage() {
  const supabase = createClient()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Password baru dan konfirmasi tidak cocok.')
      return
    }

    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }

    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({
      password: newPassword,
    })
    setLoading(false)

    if (err) {
      setError(err.message)
    } else {
      setMessage('Password berhasil diubah!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Pengaturan</h1>
      <p className="text-gray-500 mb-8">Pengaturan akun admin</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
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

            {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
            {message && <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">{message}</p>}

            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
              {loading ? 'Menyimpan...' : 'Ubah Password'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Info Sistem</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Aplikasi</span>
              <span className="font-medium text-gray-900">Sistem Manajemen Klinik</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Versi</span>
              <span className="font-medium text-gray-900">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Framework</span>
              <span className="font-medium text-gray-900">Next.js 14</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Database</span>
              <span className="font-medium text-gray-900">Supabase (PostgreSQL)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
