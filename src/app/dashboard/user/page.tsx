import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Ticket, History, User, HeartPulse, MapPin, Stethoscope, Calendar, Clock, ChevronRight } from 'lucide-react'

export default async function UserDashboard() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Ambil profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('nama')
    .eq('id', user.id)
    .maybeSingle()

  // Ambil antrian aktif hari ini
  const { data: antrianAktif } = await supabase
    .from('antrian')
    .select('*, dokter(nama), poli(nama)')
    .eq('pasien_id', user.id)
    .eq('tanggal', new Date().toISOString().split('T')[0])
    .in('status', ['menunggu', 'dipanggil'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Ambil 3 rekam medis terakhir
  const { data: riwayatMedis } = await supabase
    .from('rekam_medis')
    .select('*, dokter(nama)')
    .eq('pasien_id', user.id)
    .order('tanggal', { ascending: false })
    .limit(3)

  // Prioritaskan nama lengkap dari user_metadata atau profiles
  const displayName = user.user_metadata?.nama || profile?.nama || user.email

  return (
    <div className="space-y-8">
      {/* Welcome Banner Pasien */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 p-8 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10 text-xs font-semibold tracking-wider uppercase mb-2">
            <HeartPulse className="w-4 h-4 text-pink-300" />
            Portal Pasien
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Halo, {displayName}</h1>
          <p className="text-blue-50 font-medium max-w-lg leading-relaxed text-sm sm:text-base">
            Pantau status antrian klinik Anda secara real-time dan lihat catatan riwayat kesehatan Anda dengan mudah di satu tempat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card Antrian */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-600 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
            <Ticket className="w-40 h-40" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-sm">
                <Ticket className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Antrian Anda</p>
                <h2 className="text-2xl font-black text-slate-800 mt-1">
                  {antrianAktif ? `Nomor ${antrianAktif.nomor_antrian}` : 'Belum Ada Antrian'}
                </h2>
              </div>
            </div>

            <div className="mt-8">
              {antrianAktif ? (
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border border-blue-100 rounded-2xl p-5 text-sm space-y-4 shadow-inner">
                  <div className="flex justify-between items-center pb-3 border-b border-blue-100/50">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" /> Poli Layanan
                    </span>
                    <span className="font-bold text-blue-900 bg-white border border-blue-100 shadow-sm px-3 py-1 rounded-xl">{antrianAktif.poli?.nama || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-blue-100/50">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-emerald-400" /> Dokter Praktik
                    </span>
                    <span className="font-bold text-slate-800">{antrianAktif.dokter?.nama || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500 font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" /> Status Antrian
                    </span>
                    <span className={`font-black text-xs px-3 py-1.5 rounded-xl uppercase tracking-wide border shadow-sm ${
                      antrianAktif.status === 'dipanggil' 
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/30' 
                        : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}>
                      {antrianAktif.status}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Ticket className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="font-semibold text-slate-600">Anda belum mengambil antrian</p>
                  <p className="text-sm text-slate-400 mt-1">Silakan ambil antrian baru melalui menu di bawah.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Riwayat Medis */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-violet-600 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
            <History className="w-40 h-40" />
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-violet-500/10 text-violet-600 border border-violet-500/20 shadow-sm">
                <History className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pemeriksaan Terakhir</p>
                <h2 className="text-2xl font-black text-slate-800 mt-1">
                  {riwayatMedis && riwayatMedis.length > 0 ? `${riwayatMedis.length} Riwayat` : 'Belum Ada Pemeriksaan'}
                </h2>
              </div>
            </div>

            <div className="mt-8 flex-1">
              {riwayatMedis && riwayatMedis.length > 0 ? (
                <div className="space-y-3">
                  {riwayatMedis.map((rm) => (
                    <div key={rm.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center hover:shadow-md hover:border-violet-200 transition-all duration-300 group/item">
                      <div>
                        <p className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-violet-400" /> {rm.tanggal}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 truncate max-w-[200px] sm:max-w-[250px]">{rm.diagnosis || rm.keluhan}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex text-xs font-bold bg-white text-violet-700 border border-violet-100 px-3 py-1.5 rounded-xl shadow-sm group-hover/item:bg-violet-50">
                          {rm.dokter?.nama || '-'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 h-full">
                  <History className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="font-semibold text-slate-600">Belum ada riwayat medis</p>
                  <p className="text-sm text-slate-400 mt-1">Riwayat rekam medis Anda akan otomatis muncul di sini setelah Anda melakukan pemeriksaan di klinik.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Aksi Cepat */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Layanan Mandiri</h2>
          <p className="text-sm text-slate-500 mt-1">Akses cepat ke fitur-fitur portal pasien Anda</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/dashboard/user/antrian', label: 'Ambil Antrian Baru', desc: 'Daftar berobat hari ini', icon: <Ticket className="w-6 h-6" />, color: 'hover:border-blue-400 hover:bg-blue-50/50 text-blue-600 border-slate-100' },
            { href: '/dashboard/user/rekam-medis', label: 'Lihat Riwayat', desc: 'Cek hasil pemeriksaan', icon: <History className="w-6 h-6" />, color: 'hover:border-violet-400 hover:bg-violet-50/50 text-violet-600 border-slate-100' },
            { href: '/dashboard/user/profil', label: 'Pengaturan Profil', desc: 'Ubah data diri Anda', icon: <User className="w-6 h-6" />, color: 'hover:border-emerald-400 hover:bg-emerald-50/50 text-emerald-600 border-slate-100' },
          ].map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 bg-white group ${m.color}`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-white transition-colors shadow-sm">
                  {m.icon}
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-current transition-colors" />
              </div>
              <div>
                <span className="block font-bold text-slate-800 text-sm group-hover:text-slate-900 transition-colors">{m.label}</span>
                <span className="block text-xs text-slate-500 mt-0.5">{m.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
