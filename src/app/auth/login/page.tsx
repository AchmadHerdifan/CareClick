'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const ROLE_OPTIONS = [
  {
    role: 'user',
    label: 'Pasien',
    icon: '👤',
    desc: 'Daftar antrian & lihat rekam medis',
    gradient: 'from-blue-600 to-indigo-600',
    activeBg: 'bg-blue-500/20 border-blue-500/50',
    inactiveBg: 'bg-white/5 border-white/10',
    textColor: 'text-blue-400',
  },
  {
    role: 'admin',
    label: 'Admin',
    icon: '🛡️',
    desc: 'Kelola seluruh data klinik',
    gradient: 'from-violet-600 to-purple-600',
    activeBg: 'bg-violet-500/20 border-violet-500/50',
    inactiveBg: 'bg-white/5 border-white/10',
    textColor: 'text-violet-400',
  },
  {
    role: 'dokter',
    label: 'Dokter',
    icon: '👨‍⚕️',
    desc: 'Periksa pasien & buat rekam medis',
    gradient: 'from-emerald-600 to-teal-600',
    activeBg: 'bg-emerald-500/20 border-emerald-500/50',
    inactiveBg: 'bg-white/5 border-white/10',
    textColor: 'text-emerald-400',
  },
]

function LoginForm() {
  const searchParams = useSearchParams()
  const justRegistered = searchParams.get('registered') === 'true'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState('user')

  const activeRole = ROLE_OPTIONS.find((r) => r.role === selectedRole)!

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()

      if (!res.ok || json.error) {
        setError(json.error || 'Login gagal. Coba lagi.')
        setLoading(false)
        return
      }

      window.location.href = `/dashboard/${json.role || 'user'}`
    } catch (err) {
      setError('Koneksi gagal. Pastikan server berjalan.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl -z-10" />

      <div className="relative w-full max-w-md">
        {/* Dynamic glow border based on selected role */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${activeRole.gradient} rounded-3xl blur opacity-30 transition-all duration-500`} />
        
        {/* Card Body */}
        <div className="relative bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-block p-3.5 bg-white/5 border border-white/10 rounded-2xl shadow-inner text-3xl transition-all duration-300">
              {activeRole.icon}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">CareClick</h1>
            <p className="text-sm text-slate-400">Masuk sebagai <span className={`font-semibold ${activeRole.textColor}`}>{activeRole.label}</span></p>
          </div>

          {/* Role Selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pilih Peran</p>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.role}
                  type="button"
                  onClick={() => setSelectedRole(opt.role)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 ${
                    selectedRole === opt.role ? opt.activeBg : opt.inactiveBg + ' hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{opt.icon}</span>
                  <div>
                    <p className={`text-xs font-bold ${selectedRole === opt.role ? opt.textColor : 'text-slate-300'}`}>{opt.label}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {justRegistered && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm p-4 rounded-2xl text-center">
              🎉 Akun berhasil dibuat! Silakan masuk.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Email</label>
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
                placeholder="••••••••"
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
              disabled={loading}
              className={`w-full bg-gradient-to-r ${activeRole.gradient} hover:opacity-90 text-white font-semibold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none`}
            >
              {loading ? 'Memuat...' : `Masuk sebagai ${activeRole.label}`}
            </button>
          </form>

          {selectedRole === 'user' && (
            <p className="text-center text-sm text-slate-400">
              Belum punya akun?{' '}
              <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 hover:underline font-semibold">
                Daftar Sekarang
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
