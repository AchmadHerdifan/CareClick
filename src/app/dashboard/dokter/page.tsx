import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Users, ClipboardList, FolderOpen, Activity, ChevronRight, CheckCircle2, Clock } from 'lucide-react'
import LiveDate from '@/components/LiveDate'

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
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-600 via-emerald-500 to-emerald-700 p-8 sm:p-12 text-white shadow-2xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-teal-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider uppercase shadow-sm">
              <Activity className="w-4 h-4 text-emerald-300 animate-pulse" />
              Panel Dokter
            </div>
            <div className="text-xs font-medium text-emerald-100 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
              <LiveDate />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Selamat Datang, dr. {displayName}</h1>
          <p className="text-emerald-50 font-medium max-w-lg leading-relaxed text-sm sm:text-base">
            Pantau antrian hari ini dan catat rekam medis pasien dengan cepat. Semoga hari Anda produktif!
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[1.5rem] border border-slate-100/80 p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-emerald-500/5 to-transparent relative overflow-hidden group">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Antrian Hari Ini</p>
              <p className="text-3xl font-black text-slate-800 mt-0.5 tracking-tight">{antrianCount || 0}</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-emerald-500 transform rotate-12 group-hover:scale-125 transition-transform duration-500 pointer-events-none">
            <Users className="w-32 h-32" />
          </div>
        </div>
        
        <div className="bg-white rounded-[1.5rem] border border-slate-100/80 p-6 shadow-sm hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-teal-500/5 to-transparent relative overflow-hidden group">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-teal-500/10 text-teal-600 border border-teal-500/20 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <FolderOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Total Rekam Medis</p>
              <p className="text-3xl font-black text-slate-800 mt-0.5 tracking-tight">{rekamMedisCount || 0}</p>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-teal-500 transform -rotate-12 group-hover:scale-125 transition-transform duration-500 pointer-events-none">
            <FolderOpen className="w-32 h-32" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Antrian Aktif */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Antrian Aktif Hari Ini</h2>
              <p className="text-sm text-slate-500 mt-1">Daftar pasien yang sedang menunggu dan dipanggil</p>
            </div>
            <Link href="/dashboard/dokter/antrian" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {antrianAktif && antrianAktif.length > 0 ? (
            <div className="space-y-3">
              {antrianAktif.map((a: any) => (
                <div key={a.id} className={`rounded-2xl p-4 flex items-center justify-between border transition-all hover:shadow-md ${a.status === 'dipanggil' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-xl shadow-sm ${a.status === 'dipanggil' ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-white text-emerald-600 border border-emerald-100'}`}>
                      {a.nomor_antrian}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-base">{a.pasien?.nama || '-'}</p>
                      <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                        <Activity className="w-3 h-3" /> {a.poli?.nama || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border ${
                      a.status === 'dipanggil' 
                        ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200' 
                        : 'bg-amber-100/50 text-amber-700 border-amber-200'
                    }`}>
                      {a.status === 'dipanggil' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <ClipboardList className="w-12 h-12 text-slate-300 mb-3" />
              <p className="font-semibold text-slate-600">Tidak ada antrian aktif</p>
              <p className="text-sm text-slate-400 mt-1">Belum ada pasien yang menunggu saat ini.</p>
            </div>
          )}
        </div>

        {/* Aksi Cepat */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Aksi Cepat</h2>
            <p className="text-sm text-slate-500 mt-1">Navigasi cepat ke fitur dokter</p>
          </div>
          
          <div className="mt-6 flex flex-col gap-4 flex-grow">
            <Link
              href="/dashboard/dokter/antrian"
              className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 bg-white group hover:border-emerald-400 hover:bg-emerald-50/30"
            >
              <div className="p-3 rounded-xl bg-emerald-100/50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="block font-bold text-slate-700 text-sm group-hover:text-emerald-700 transition-colors">Lihat Antrian Pasien</span>
                <span className="text-xs text-slate-400 mt-0.5">Kelola status panggilan</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500" />
            </Link>

            <Link
              href="/dashboard/dokter/rekam-medis"
              className="flex items-center gap-4 p-5 rounded-2xl border border-slate-100 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 bg-white group hover:border-teal-400 hover:bg-teal-50/30"
            >
              <div className="p-3 rounded-xl bg-teal-100/50 text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="block font-bold text-slate-700 text-sm group-hover:text-teal-700 transition-colors">Input Rekam Medis</span>
                <span className="text-xs text-slate-400 mt-0.5">Catat hasil pemeriksaan</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
