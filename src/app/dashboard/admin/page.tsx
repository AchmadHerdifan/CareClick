import { createServerSupabaseClient } from '@/lib/supabase-server'

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
      icon: '👤', 
      color: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
      gradient: 'from-blue-500/5 to-transparent' 
    },
    { 
      label: 'Total Dokter', 
      value: jumlahDokter ?? 0, 
      icon: '👨‍⚕️', 
      color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
      gradient: 'from-emerald-500/5 to-transparent'
    },
    { 
      label: 'Antrian Menunggu', 
      value: antrianHariIni ?? 0, 
      icon: '🎟️', 
      color: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
      gradient: 'from-amber-500/5 to-transparent'
    },
    { 
      label: 'Total Rekam Medis', 
      value: totalRekamMedis ?? 0, 
      icon: '📁', 
      color: 'bg-violet-500/10 text-violet-500 border border-violet-500/20',
      gradient: 'from-violet-500/5 to-transparent'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Admin</h1>
          <p className="text-blue-100 font-medium max-w-md">
            Selamat datang di portal manajemen CareClick. Kelola aktivitas klinik hari ini dengan efisien.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className={`relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-br ${s.gradient}`}>
            <div className={`text-2xl w-14 h-14 rounded-2xl flex items-center justify-center font-bold ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Menu */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Menu Akses Cepat</h2>
          <p className="text-xs text-slate-400">Navigasikan operasional harian Anda dalam satu klik</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: '/dashboard/admin/pasien', label: 'Kelola Pasien', icon: '👤', color: 'hover:border-blue-300 hover:bg-blue-50/50 text-blue-600' },
            { href: '/dashboard/admin/dokter', label: 'Kelola Dokter', icon: '👨‍⚕️', color: 'hover:border-emerald-300 hover:bg-emerald-50/50 text-emerald-600' },
            { href: '/dashboard/admin/poli', label: 'Kelola Poli', icon: '🏥', color: 'hover:border-indigo-300 hover:bg-indigo-50/50 text-indigo-600' },
            { href: '/dashboard/admin/antrian', label: 'Antrian Hari Ini', icon: '📋', color: 'hover:border-amber-300 hover:bg-amber-50/50 text-amber-600' },
            { href: '/dashboard/admin/rekam-medis', label: 'Rekam Medis', icon: '📁', color: 'hover:border-violet-300 hover:bg-violet-50/50 text-violet-600' },
            { href: '/dashboard/admin/pengaturan', label: 'Pengaturan', icon: '⚙️', color: 'hover:border-slate-300 hover:bg-slate-50/50 text-slate-600' },
          ].map((m) => (
            <a
              key={m.href}
              href={m.href}
              className={`flex items-center gap-4 p-5 rounded-2xl border border-slate-100 transition-all duration-200 shadow-sm hover:shadow ${m.color}`}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="font-semibold text-slate-700 text-sm">{m.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
