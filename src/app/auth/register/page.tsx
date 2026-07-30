'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { registerAction } from '../actions'
import { createClient } from '@/lib/supabase'

const ROLE_OPTIONS = [
  {
    role: 'user',
    label: 'Pasien',
    icon: '👤',
    desc: 'Daftar antrian & lihat rekam medis',
    activeBg: 'bg-blue-500/20 border-blue-500/50',
    inactiveBg: 'bg-white/5 border-white/10',
    textColor: 'text-blue-400',
    gradient: 'from-blue-600 to-indigo-600',
    glowBorder: 'from-blue-500 to-indigo-600',
  },
  {
    role: 'admin',
    label: 'Admin',
    icon: '🛡️',
    desc: 'Kelola seluruh data klinik',
    activeBg: 'bg-violet-500/20 border-violet-500/50',
    inactiveBg: 'bg-white/5 border-white/10',
    textColor: 'text-violet-400',
    gradient: 'from-violet-600 to-purple-600',
    glowBorder: 'from-violet-500 to-purple-600',
  },
  {
    role: 'dokter',
    label: 'Dokter',
    icon: '👨‍⚕️',
    desc: 'Periksa pasien & buat rekam medis',
    activeBg: 'bg-emerald-500/20 border-emerald-500/50',
    inactiveBg: 'bg-white/5 border-white/10',
    textColor: 'text-emerald-400',
    gradient: 'from-emerald-600 to-teal-600',
    glowBorder: 'from-emerald-500 to-teal-600',
  },
]

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [selectedRole, setSelectedRole] = useState('user')
  const [poliList, setPoliList] = useState<any[]>([])

  useEffect(() => {
    async function fetchPoli() {
      const supabase = createClient()
      const { data } = await supabase.from('poli').select('id, nama').order('nama')
      if (data) setPoliList(data)
    }
    fetchPoli()
  }, [])

  const activeRole = ROLE_OPTIONS.find((r) => r.role === selectedRole)!

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.set('role', selectedRole)
    startTransition(async () => {
      const result = await registerAction(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl -z-10" />

      <div className="relative w-full max-w-md my-8">
        {/* Dynamic glow border */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${activeRole.glowBorder} rounded-3xl blur opacity-30 transition-all duration-500`} />
        
        {/* Card Body */}
        <div className="relative bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-block p-3.5 bg-white/5 border border-white/10 rounded-2xl shadow-inner text-3xl transition-all duration-300">
              {activeRole.icon}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Buat Akun</h1>
            <p className="text-sm text-slate-400">
              Daftar sebagai{' '}
              <span className={`font-semibold ${activeRole.textColor}`}>{activeRole.label}</span>
            </p>
          </div>

          {/* Role Selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pilih Peran Akun</p>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => setSelectedRole(opt.role)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 ${
                    selectedRole === opt.role
                      ? opt.activeBg
                      : opt.inactiveBg + ' hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{opt.icon}</span>
                  <div>
                    <p className={`text-xs font-bold ${selectedRole === opt.role ? opt.textColor : 'text-slate-300'}`}>
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-slate-300">

            {/* Nama Lengkap — selalu tampil */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Nama lengkap sesuai KTP"
                required
              />
            </div>

            {/* Field khusus Pasien (user) */}
            {selectedRole === 'user' && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">NIK (16 Digit)</label>
                  <input
                    type="text"
                    name="nik"
                    maxLength={16}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="16 digit NIK Anda"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Tanggal Lahir</label>
                    <input
                      type="date"
                      name="tanggal_lahir"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Jenis Kelamin</label>
                    <select
                      name="jenis_kelamin"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      required
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">No. Telepon</label>
                  <input
                    type="tel"
                    name="no_telepon"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: 081234567890"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Alamat Lengkap</label>
                  <textarea
                    name="alamat"
                    rows={2}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    placeholder="Alamat domisili saat ini"
                    required
                  />
                </div>
              </>
            )}

            {/* Field khusus Dokter */}
            {selectedRole === 'dokter' && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Spesialisasi</label>
                  <input
                    type="text"
                    name="spesialisasi"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Misal: Umum, Gigi, Anak"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Nomor STR</label>
                  <input
                    type="text"
                    name="no_str"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nomor Surat Tanda Registrasi"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Pilih Poli</label>
                  <select
                    name="poli_id"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    required
                  >
                    <option value="">-- Pilih Poli Tujuan --</option>
                    {poliList.map((p) => (
                      <option key={p.id} value={p.id}>{p.nama}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="border-t border-white/10 pt-4" />

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Akun</label>
              <input
                type="email"
                name="email"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="nama@email.com"
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
              <input
                type="password"
                name="password"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Minimal 6 karakter"
                required
              />
            </div>

            {error && (
              <p className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl text-center">
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={`w-full bg-gradient-to-r ${activeRole.gradient} hover:opacity-90 text-white font-semibold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none`}
            >
              {isPending ? 'Memuat...' : `Daftar sebagai ${activeRole.label}`}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 hover:underline font-semibold">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
