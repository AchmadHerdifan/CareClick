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

export default function SidebarAdmin({
  userEmail,
  isOpen = true,
  onToggle,
}: {
  userEmail: string
  isOpen?: boolean
  onToggle?: () => void
}) {
  const pathname = usePathname()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`w-64 bg-slate-950 text-slate-300 fixed top-0 bottom-0 left-0 h-full flex flex-col border-r border-white/5 z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-7 h-7 object-contain drop-shadow-md"
                onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.parentElement?.insertAdjacentText('beforeend', '🏥') }} 
              />
            </div>
            <div>
              <p className="font-extrabold text-white text-base tracking-tight leading-tight">
                CareClick
              </p>
              <p className="text-[10px] text-cyan-400 tracking-widest uppercase mt-0.5">
                Clinic OS
              </p>
            </div>
          </div>

          {/* Close button for Mobile / Responsive */}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Tutup Menu"
            >
              ✕
            </button>
          )}
        </div>

        <div className="px-5 pt-3">
          <span className="inline-block text-[10px] bg-cyan-500/15 text-cyan-400 px-2.5 py-0.5 rounded-full font-bold border border-cyan-500/20 shadow-sm shadow-cyan-500/10">
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
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
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
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Akun Aktif
            </p>
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
    </>
  )
}
