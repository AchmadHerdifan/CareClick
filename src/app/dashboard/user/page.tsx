import { createServerSupabaseClient } from '@/lib/supabase-server'

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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full uppercase tracking-wider">Portal Pasien</span>
          <h1 className="text-3xl font-extrabold tracking-tight">Selamat Datang, {displayName}</h1>
          <p className="text-emerald-50 font-medium max-w-md">
            Pantau status antrian klinik Anda dan lihat catatan rekam medis secara real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Antrian */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/15">
              🎟️
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status Antrian Hari Ini</p>
              <h2 className="text-2xl font-extrabold text-slate-800 mt-1">
                {antrianAktif ? `Nomor ${antrianAktif.nomor_antrian}` : 'Belum Ada Antrian'}
              </h2>
            </div>
          </div>

          {antrianAktif ? (
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 text-sm space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Poli Layanan</span>
                <span className="font-semibold text-slate-800 bg-white border border-slate-200/60 px-2.5 py-1 rounded-xl text-xs">{antrianAktif.poli?.nama || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Dokter Praktik</span>
                <span className="font-semibold text-slate-800">{antrianAktif.dokter?.nama || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Status Antrian</span>
                <span className={`font-semibold text-xs px-2.5 py-1 rounded-xl uppercase ${
                  antrianAktif.status === 'dipanggil' 
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                }`}>
                  {antrianAktif.status}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-4 text-center">Silakan klik "Ambil Antrian Baru" untuk mendaftar antrian hari ini.</p>
          )}
        </div>

        {/* Card Riwayat Medis */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl w-12 h-12 rounded-2xl flex items-center justify-center bg-violet-500/10 text-violet-500 border border-violet-500/15">
              📁
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pemeriksaan Terakhir</p>
              <h2 className="text-2xl font-extrabold text-slate-800 mt-1">
                {riwayatMedis && riwayatMedis.length > 0 ? `${riwayatMedis.length} Riwayat` : 'Belum Ada Pemeriksaan'}
              </h2>
            </div>
          </div>

          {riwayatMedis && riwayatMedis.length > 0 ? (
            <div className="space-y-2.5">
              {riwayatMedis.map((rm) => (
                <div key={rm.id} className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 text-sm flex justify-between items-center hover:bg-slate-100/50 transition-colors">
                  <div>
                    <p className="font-bold text-slate-800">{rm.tanggal}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">{rm.diagnosis || rm.keluhan}</p>
                  </div>
                  <span className="text-xs font-semibold bg-violet-100/70 text-violet-700 border border-violet-200/50 px-2.5 py-1 rounded-xl">
                    {rm.dokter?.nama || '-'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 py-4 text-center">Riwayat rekam medis Anda akan muncul setelah Anda melakukan pemeriksaan.</p>
          )}
        </div>
      </div>

      {/* Aksi Cepat */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Layanan Mandiri</h2>
          <p className="text-xs text-slate-400">Akses cepat ke fitur-fitur portal pasien Anda</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/dashboard/user/antrian', label: 'Ambil Antrian Baru', icon: '🎟️', color: 'hover:border-blue-300 hover:bg-blue-50/50 text-blue-600' },
            { href: '/dashboard/user/rekam-medis', label: 'Lihat Rekam Medis', icon: '📋', color: 'hover:border-violet-300 hover:bg-violet-50/50 text-violet-600' },
            { href: '/dashboard/user/profil', label: 'Pengaturan Profil', icon: '👤', color: 'hover:border-emerald-300 hover:bg-emerald-50/50 text-emerald-600' },
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
