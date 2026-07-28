'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Poli, Dokter, Antrian } from '@/types'

const statusColors: Record<string, string> = {
  menunggu: 'badge-menunggu',
  dipanggil: 'badge-dipanggil',
  selesai: 'badge-selesai',
  batal: 'badge-batal',
}

export default function AntrianUserPage() {
  const supabase = createClient()
  const [step, setStep] = useState<'list' | 'pilih-poli' | 'pilih-dokter'>('list')
  const [poliList, setPoliList] = useState<Poli[]>([])
  const [dokterList, setDokterList] = useState<Dokter[]>([])
  const [selectedPoli, setSelectedPoli] = useState<Poli | null>(null)
  const [riwayatAntrian, setRiwayatAntrian] = useState<Antrian[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userId, setUserId] = useState<string>('')

  async function fetchData() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
      const { data: antrians } = await supabase
        .from('antrian')
        .select('*, dokter(nama), poli(nama)')
        .eq('pasien_id', user.id)
        .order('tanggal', { ascending: false })
        .order('nomor_antrian', { ascending: false })
        .limit(10)
      setRiwayatAntrian(antrians || [])
    }
    const { data: polis } = await supabase.from('poli').select('*').order('nama')
    setPoliList(polis || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  async function handlePilihPoli(poli: Poli) {
    setSelectedPoli(poli)
    const { data: dokters } = await supabase
      .from('dokter')
      .select('*')
      .eq('poli_id', poli.id)
      .order('nama')
    setDokterList(dokters || [])
    setStep('pilih-dokter')
  }

  async function handleAmbilNomor(dokterId: string) {
    if (!userId) return
    setSubmitting(true)

    const today = new Date().toISOString().split('T')[0]

    // Cek apakah sudah ada antrian aktif hari ini
    const { data: existing } = await supabase
      .from('antrian')
      .select('id')
      .eq('pasien_id', userId)
      .eq('tanggal', today)
      .in('status', ['menunggu', 'dipanggil'])
      .limit(1)

    if (existing && existing.length > 0) {
      alert('Anda sudah memiliki antrian aktif hari ini.')
      setSubmitting(false)
      return
    }

    // Hitung nomor antrian
    const { count } = await supabase
      .from('antrian')
      .select('*', { count: 'exact', head: true })
      .eq('tanggal', today)

    await supabase.from('antrian').insert({
      pasien_id: userId,
      dokter_id: dokterId,
      poli_id: selectedPoli?.id || null,
      tanggal: today,
      nomor_antrian: (count || 0) + 1,
      status: 'menunggu',
    })

    setSubmitting(false)
    setStep('list')
    fetchData()
    alert('Antrian berhasil diambil!')
  }

  if (loading) {
    return <p className="text-gray-500 text-center py-8">Memuat...</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Antrian Saya</h1>
      <p className="text-gray-500 mb-6">Ambil antrian atau lihat status antrian Anda</p>

      {step === 'list' && (
        <>
          <button onClick={() => setStep('pilih-poli')} className="btn-primary mb-6">
            + Ambil Antrian Baru
          </button>

          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Riwayat Antrian</h2>
            {riwayatAntrian.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Belum ada riwayat antrian.</p>
            ) : (
              <div className="space-y-3">
                {riwayatAntrian.map((a) => (
                  <div key={a.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-gray-900">No. {a.nomor_antrian}</span>
                        <span className={statusColors[a.status]}>{a.status}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {a.tanggal} • {a.poli?.nama || '-'} • {a.dokter?.nama || '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {step === 'pilih-poli' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pilih Poli</h2>
            <button onClick={() => setStep('list')} className="text-sm text-gray-500 hover:underline">← Kembali</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {poliList.map((poli) => (
              <button
                key={poli.id}
                onClick={() => handlePilihPoli(poli)}
                className="text-left border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <p className="font-semibold text-gray-900">{poli.nama}</p>
                <p className="text-sm text-gray-500 mt-1">{poli.keterangan}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'pilih-dokter' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pilih Dokter — Poli {selectedPoli?.nama}</h2>
            <button onClick={() => setStep('pilih-poli')} className="text-sm text-gray-500 hover:underline">← Kembali</button>
          </div>
          {dokterList.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Tidak ada dokter di poli ini.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dokterList.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleAmbilNomor(d.id)}
                  disabled={submitting}
                  className="text-left border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <p className="font-semibold text-gray-900">{d.nama}</p>
                  <p className="text-sm text-gray-500">{d.spesialisasi}</p>
                  {d.jadwal && d.jadwal.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {d.jadwal.map((j, i) => (
                        <span key={i} className="text-xs bg-gray-100 rounded px-1.5 py-0.5">
                          {j.hari} {j.jam_mulai}-{j.jam_selesai}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
