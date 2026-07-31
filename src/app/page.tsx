import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative overflow-hidden flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      
      {/* Background Mesh Gradient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 to-indigo-600/0 rounded-full blur-3xl -z-10 animate-pulse duration-4000" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-violet-600/10 to-transparent rounded-full blur-3xl -z-10 animate-pulse duration-3000" />

      {/* Header / Navbar */}
      <header className="max-w-7xl mx-auto w-full px-6 md:px-12 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/20 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Logo CareClick" 
              className="w-7 h-7 object-contain drop-shadow-md"
            />
          </div>
          <span className="font-black text-white text-2xl tracking-tight bg-clip-text bg-gradient-to-r from-white to-slate-400">
            CareClick
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
            Masuk
          </Link>
          <Link href="/auth/register" className="bg-white hover:bg-slate-100 text-slate-950 text-sm font-extrabold px-5 py-2.5 rounded-xl shadow-xl transition-all active:scale-[0.98]">
            Daftar Pasien
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start z-10 flex-1">
        
        {/* Left Side: Brand and Patient Capabilities */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-semibold tracking-wide w-fit">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>Sistem Manajemen Klinik Terintegrasi</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight text-white">
              Solusi digital operasional <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
                klinik masa kini.
              </span>
            </h1>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
              Integrasi tanpa batas untuk pasien dan staf klinik. Mempermudah registrasi mandiri, pencatatan rekam medis terpadu, dan manajemen alur pelayanan yang efisien.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/login" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-8 py-4 rounded-xl shadow-lg shadow-blue-600/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all text-sm text-center">
              Masuk Dashboard
            </Link>
            <Link href="/auth/register" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-extrabold px-8 py-4 rounded-xl transition-all active:scale-[0.98] text-sm text-center">
              Daftar Pasien Baru
            </Link>
          </div>

          {/* Fitur Pasien (Apa yang bisa dilakukan Pasien) */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400">🟢</span> Layanan Mandiri Pasien
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Daftar Antrian Online', desc: 'Ambil nomor antrian instan berdasarkan poli dan dokter dari rumah.', icon: '🎟️' },
                { title: 'Pantau Antrian Real-time', desc: 'Cek nomor antrian yang sedang dipanggil langsung dari HP.', icon: '🔢' },
                { title: 'Akses Rekam Medis', desc: 'Lihat riwayat hasil pemeriksaan, diagnosis, dan resep dokter.', icon: '📁' },
                { title: 'Kelola Profil Mandiri', desc: 'Perbarui NIK, alamat, no. telepon, dan password kapan saja.', icon: '👤' },
              ].map((item) => (
                <div key={item.title} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-1 hover:bg-white/10 transition-colors">
                  <span className="text-2xl block">{item.icon}</span>
                  <h3 className="font-extrabold text-white text-sm">{item.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Admin Capabilities */}
        <div className="lg:col-span-6 space-y-6 lg:mt-0 mt-8">
          
          {/* Fitur Admin (Apa yang bisa dilakukan Admin) */}
          <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-indigo-400">🛡️</span> Sistem Kontrol Staf & Admin
              </h2>
              <p className="text-xs text-slate-400 mt-1">Hak akses penuh untuk mengelola operasional harian klinik.</p>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Kelola Pasien & Dokter', desc: 'CRUD lengkap data pasien medis serta nomor surat tanda registrasi (STR) dokter.', icon: '👥', color: 'bg-blue-500/10 text-blue-400' },
                { title: 'Manajemen Spesialisasi Poli', desc: 'Tambahkan dan atur data poli klinik (Umum, Gigi, UGD, dll).', icon: '🏥', color: 'bg-emerald-500/10 text-emerald-400' },
                { title: 'Input Rekam Medis Elektronik', desc: 'Catat keluhan, diagnosis klinis, dan resep obat pasien pasca konsultasi.', icon: '✍️', color: 'bg-violet-500/10 text-violet-400' },
                { title: 'Kontrol Panggilan Antrian', desc: 'Kelola pemanggilan antrian harian (Panggil, Selesai, Batal) secara terpadu.', icon: '🔢', color: 'bg-amber-500/10 text-amber-400' },
                { title: 'Informasi & Pengaturan Sistem', desc: 'Pantau status database dan ubah password administrator untuk keamanan.', icon: '⚙️', color: 'bg-slate-500/10 text-slate-400' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-3.5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.color} flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-white text-sm">{item.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">CareClick Administration System</span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer Info & Tech Stacks */}
      <footer className="border-t border-white/5 bg-slate-950/40 py-8 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-sm overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Logo CareClick" 
                className="w-5 h-5 object-contain"
              />
            </div>
            <span className="font-extrabold text-white text-sm">CareClick</span>
          </div>
          
          {/* Tech badges */}
          <div className="flex flex-wrap gap-2">
            {['Next.js 14', 'TypeScript', 'TailwindCSS', 'Supabase'].map((tech) => (
              <span key={tech} className="bg-white/5 border border-white/5 text-slate-500 px-3 py-1 rounded-lg text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CareClick. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
