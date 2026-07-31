'use client'

import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'

export default function LiveDate() {
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    // Fungsi untuk memformat tanggal
    const updateDate = () => {
      const now = new Date()
      const formatted = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      setDate(formatted)
    }

    updateDate()
    
    // Opsional: Jika aplikasi dibiarkan menyala hingga tengah malam
    const timer = setInterval(updateDate, 60000)
    return () => clearInterval(timer)
  }, [])

  // Mencegah hydration mismatch dengan render awal kosong/skeleton jika belum termount
  if (!date) return <span className="opacity-0">Loading date...</span>

  return (
    <div className="inline-flex items-center gap-1.5 opacity-90">
      <Calendar className="w-3.5 h-3.5" />
      <span>{date}</span>
    </div>
  )
}
