import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Users, UserCog, Stethoscope, ClipboardList, FolderOpen, Settings } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient()

  const [{ count: jumlahPasien }, { count: jumlahDokter }, { count: antrianHariIni }, { count: totalRekamMedis }] =
    await Promise.all([
      supabase.from('pasien').select('*', { count: 'exact', head: true }),
      supabase.from('dokter').select('*', { count: 'exact', head: true }),
      supabase
        .from('antrian')
        .select('*', { count: 'exact', head: true })
        .eq('tanggal', new Date().toISOString().split('T')[0])
        .eq('status', 'menunggu'),
      supabase.from('rekam_medis').select('*', { count: 'exact', head: true }),
    ])

  const stats = [
    { 
      label: 'Total Pasien', 
      value: jumlahPasien ?? 0, 
      icon: <Users className="w-7 h-7" />, 
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      gradient: 'from-blue-500/5 to-transparent' 
    },
    { 
      label: 'Total Dokter', 
      value: jumlahDokter ?? 0, 
      icon: <Stethoscope className="w-7 h-7" />, 
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      gradient: 'from-emerald-500/5 to-transparent'
    },
    { 
      label: 'Antrian Menunggu', 
      value: antrianHariIni ?? 0, 
      icon: <ClipboardList className="w-7 h-7" />, 
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      gradient: 'from-amber-500/5 to-transparent'
    },
    { 
      label: 'Total Rekam Medis', 
      value: totalRekamMedis ?? 0, 
      icon: <FolderOpen className="w-7 h-7" />, 
      color: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
      gradient: 'from-violet-500/5 to-transparent'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 p-8 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 text-xs font-semibold tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sistem Aktif
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Dashboard Admin</h1>
          <p className="text-blue-100 font-medium max-w-lg leading-relaxed text-sm sm:text-base">
            Selamat datang di portal manajemen CareClick. Pantau dan kelola seluruh aktivitas klinik hari ini dengan efisien dan real-time.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className={`relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${s.gradient}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold border ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Menu */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Menu Akses Cepat</h2>
          <p className="text-sm text-slate-500 mt-1">Navigasikan operasional harian Anda dalam satu klik</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: '/dashboard/admin/pasien', label: 'Kelola Pasien', icon: <Users className="w-6 h-6" />, color: 'hover:border-blue-400 hover:bg-blue-50/50 text-blue-600 border-slate-100' },
            { href: '/dashboard/admin/dokter', label: 'Kelola Dokter', icon: <UserCog className="w-6 h-6" />, color: 'hover:border-emerald-400 hover:bg-emerald-50/50 text-emerald-600 border-slate-100' },
            { href: '/dashboard/admin/poli', label: 'Kelola Poli', icon: <Stethoscope className="w-6 h-6" />, color: 'hover:border-indigo-400 hover:bg-indigo-50/50 text-indigo-600 border-slate-100' },
            { href: '/dashboard/admin/antrian', label: 'Antrian Hari Ini', icon: <ClipboardList className="w-6 h-6" />, color: 'hover:border-amber-400 hover:bg-amber-50/50 text-amber-600 border-slate-100' },
            { href: '/dashboard/admin/rekam-medis', label: 'Rekam Medis', icon: <FolderOpen className="w-6 h-6" />, color: 'hover:border-violet-400 hover:bg-violet-50/50 text-violet-600 border-slate-100' },
            { href: '/dashboard/admin/pengaturan', label: 'Pengaturan', icon: <Settings className="w-6 h-6" />, color: 'hover:border-slate-400 hover:bg-slate-50/50 text-slate-600 border-slate-100' },
          ].map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 bg-white group ${m.color}`}
            >
              <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-white transition-colors">
                {m.icon}
              </div>
              <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900 transition-colors">{m.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
