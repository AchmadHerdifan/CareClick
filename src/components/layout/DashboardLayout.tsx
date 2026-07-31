'use client'

import React, { useState } from 'react'

export default function DashboardLayout({
  sidebar,
  children,
  bgClassName = "bg-gradient-to-br from-blue-100 via-sky-50 to-cyan-100",
}: {
  sidebar: React.ReactElement<{ isOpen: boolean; onToggle: () => void }>
  children: React.ReactNode
  bgClassName?: string
}) {
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => setIsOpen((prev) => !prev)

  return (
    <div className={`min-h-screen flex relative ${bgClassName}`}>
      {/* Render Sidebar dengan props isOpen dan onToggle */}
      <div className="z-40 relative shadow-xl shadow-slate-200/50">
        {React.cloneElement(sidebar, { isOpen, onToggle: toggleSidebar })}
      </div>

      {/* Main Content Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        {/* Top Navbar Header dengan Tombol Toggle Sidebar */}
        <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md text-white border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 flex items-center gap-2 text-xs sm:text-sm font-semibold border border-white/10 shadow-inner"
              title={isOpen ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar'}
            >
              <span className="text-base leading-none">{isOpen ? '◀' : '☰'}</span>
              <span className="hidden sm:inline font-bold">
                {isOpen ? 'Sembunyikan Menu' : 'Tampilkan Menu'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-bold shadow-sm shadow-cyan-500/5">
              CareClick OS
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
