import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function DashboardApoteker() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const displayName = user.user_metadata?.nama || user.email

  const { count: resepMenunggu } = await supabase
    .from('rekam_medis')
    .select('*', { count: 'exact', head: true })
    .eq('status_resep', 'menunggu')
    .not('resep', 'is', null)

  const { count: resepSelesai } = await supabase
    .from('rekam_medis')
    .select('*', { count: 'exact', head: true })
    .eq('status_resep', 'selesai')

  const { count: totalObat } = await supabase
    .from('obat')
    .select('*', { count: 'exact', head: true })

  const { data: resepTerbaru } = await supabase
    .from('rekam_medis')
    .select('*, pasien(nama), dokter(nama)')
    .eq('status_resep', 'menunggu')
    .not('resep', 'is', null)
    .order('tanggal', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">Panel Apoteker</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Selamat Datang, {displayName}</h1>
          <p className="text-amber-50 font-medium max-w-md">
            Proses resep dari dokter, kelola stok obat, dan berikan rincian biaya ke pasien.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-2xl w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/10 text-amber-500 border border-amber-500/15">⏳</div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resep Menunggu</p>
              <p className="text-3xl font-extrabold text-amber-600">{resepMenunggu || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-2xl w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/15">✅</div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resep Selesai</p>
              <p className="text-3xl font-extrabold text-emerald-600">{resepSelesai || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="text-2xl w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/15">💊</div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jenis Obat</p>
              <p className="text-3xl font-extrabold text-blue-600">{totalObat || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resep Menunggu */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Resep Menunggu Diproses</h2>
        {resepTerbaru && resepTerbaru.length > 0 ? (
          <div className="space-y-2.5">
            {resepTerbaru.map((r: any) => (
              <div key={r.id} className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{r.pasien?.nama || '-'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Dokter: {r.dokter?.nama || '-'} · {r.tanggal}</p>
                    <p className="text-sm text-amber-800 mt-2 whitespace-pre-wrap">{r.resep}</p>
                  </div>
                  <span className="text-xs font-bold bg-amber-200 text-amber-800 px-2.5 py-1 rounded-xl ml-4 shrink-0">Menunggu</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 py-4 text-center">Tidak ada resep yang menunggu.</p>
        )}
      </div>

      {/* Aksi Cepat */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Aksi Cepat</h2>
          <p className="text-xs text-slate-400">Navigasi cepat ke fitur apoteker</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { href: '/dashboard/apoteker/resep', label: 'Proses Resep Dokter', icon: '📋', color: 'hover:border-amber-300 hover:bg-amber-50/50 text-amber-600' },
            { href: '/dashboard/apoteker/master-obat', label: 'Kelola Master Obat', icon: '💊', color: 'hover:border-blue-300 hover:bg-blue-50/50 text-blue-600' },
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
