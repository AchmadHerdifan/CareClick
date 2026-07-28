'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const menus = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/dashboard/admin/pasien', label: 'Pasien', icon: '👤' },
  { href: '/dashboard/admin/dokter', label: 'Dokter', icon: '👨‍⚕️' },
  { href: '/dashboard/admin/poli', label: 'Poli', icon: '🏥' },
  { href: '/dashboard/admin/rekam-medis', label: 'Rekam Medis', icon: '📁' },
  { href: '/dashboard/admin/antrian', label: 'Antrian', icon: '🔢' },
  { href: '/dashboard/admin/pengaturan', label: 'Pengaturan', icon: '⚙️' },
]

export default function SidebarAdmin({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 fixed h-full flex flex-col border-r border-white/5 z-30">
      
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-white/5 space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xl">
            🏥
          </div>
          <div>
            <p className="font-extrabold text-white text-base tracking-tight leading-tight">CareClick</p>
            <p className="text-[10px] text-slate-500 tracking-widest uppercase mt-0.5">Clinic OS</p>
          </div>
        </div>
        <span className="inline-block text-[10px] bg-blue-500/15 text-blue-400 px-2.5 py-0.5 rounded-full font-bold border border-blue-500/20">
          Administrator
        </span>
      </div>

      {/* Navigation Menus */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menus.map((m) => {
          const isActive = pathname === m.href
          return (
            <Link
              key={m.href}
              href={m.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/10'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-lg">{m.icon}</span>
              {m.label}
            </Link>
          )
        })}
      </nav>

      {/* User Session Section */}
      <div className="p-4 border-t border-white/5 bg-slate-950/40">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 space-y-2">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Akun Aktif</p>
          <p className="text-xs text-white truncate font-medium">{userEmail}</p>
          <button
            onClick={handleLogout}
            className="w-full mt-2 text-center text-xs text-rose-400 hover:text-rose-300 font-bold py-2 bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/10 rounded-xl transition-colors"
          >
            🚪 Keluar
          </button>
        </div>
      </div>
    </aside>
  )
}
