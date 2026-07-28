import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function DashboardDokter() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = new Date().toISOString().split('T')[0]
  const displayName = user.user_metadata?.nama || user.email

  // Get doctor's info
  const { data: dokterData } = await supabase
    .from('dokter')
    .select('poli_id')
    .eq('id', user.id)
    .single()

  const dokterPoliId = dokterData?.poli_id

  let antrianQuery = supabase
    .from('antrian')
    .select('*', { count: 'exact', head: true })
    .eq('tanggal', today)
  
  if (dokterPoliId) {
    antrianQuery = antrianQuery.eq('poli_id', dokterPoliId)
  }
  const { count: antrianCount } = await antrianQuery

  const { count: rekamMedisCount } = await supabase
    .from('rekam_medis')
    .select('*', { count: 'exact', head: true })
    .eq('dokter_id', user.id) // Only count their own records

  let antrianAktifQuery = supabase
    .from('antrian')
    .select('*, pasien(nama), poli(nama)')
    .eq('tanggal', today)
    .in('status', ['menunggu', 'dipanggil'])
    .order('nomor_antrian', { ascending: true })
    .limit(5)
  
  if (dokterPoliId) {
    antrianAktifQuery = antrianAktifQuery.eq('poli_id', dokterPoliId)
  }
  const { data: antrianAktif } = await antrianAktifQuery

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">Panel Dokter</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Selamat Datang, {displayName}</h1>
          <p className="text-emerald-50 font-medium max-w-md">
            Kelola pasien, tulis rekam medis, dan pantau antrian hari ini.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-2xl w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/15">🎟️</div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Antrian Hari Ini</p>
              <p className="text-3xl font-extrabold text-slate-800">{antrianCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-2xl w-12 h-12 rounded-2xl flex items-center justify-center bg-teal-500/10 text-teal-500 border border-teal-500/15">📁</div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Rekam Medis</p>
              <p className="text-3xl font-extrabold text-slate-800">{rekamMedisCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Antrian Aktif */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Antrian Aktif Hari Ini</h2>
        {antrianAktif && antrianAktif.length > 0 ? (
          <div className="space-y-2.5">
            {antrianAktif.map((a: any) => (
              <div key={a.id} className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-emerald-600 w-8 text-center">{a.nomor_antrian}</span>
                  <div>
                    <p className="font-semibold text-slate-800">{a.pasien?.nama || '-'}</p>
                    <p className="text-xs text-slate-400">{a.poli?.nama || '-'}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-xl uppercase ${a.status === 'dipanggil' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 py-4 text-center">Tidak ada antrian aktif hari ini.</p>
        )}
      </div>

      {/* Aksi Cepat */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Aksi Cepat</h2>
          <p className="text-xs text-slate-400">Navigasi cepat ke fitur dokter</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { href: '/dashboard/dokter/antrian', label: 'Lihat Antrian Pasien', icon: '👥', color: 'hover:border-emerald-300 hover:bg-emerald-50/50 text-emerald-600' },
            { href: '/dashboard/dokter/rekam-medis', label: 'Input Rekam Medis', icon: '📋', color: 'hover:border-teal-300 hover:bg-teal-50/50 text-teal-600' },
          ].map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`flex items-center gap-4 p-5 rounded-2xl border border-slate-100 transition-all duration-200 shadow-sm hover:shadow ${m.color}`}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="font-semibold text-slate-700 text-sm">{m.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
