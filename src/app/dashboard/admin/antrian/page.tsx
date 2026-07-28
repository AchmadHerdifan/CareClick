'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Antrian, Pasien, Dokter, Poli } from '@/types'

const statusColors: Record<string, string> = {
  menunggu: 'badge-menunggu',
  dipanggil: 'badge-dipanggil',
  selesai: 'badge-selesai',
  batal: 'badge-batal',
}

export default function AntrianPage() {
  const supabase = createClient()
  const [data, setData] = useState<Antrian[]>([])
  const [pasienList, setPasienList] = useState<Pasien[]>([])
  const [dokterList, setDokterList] = useState<Dokter[]>([])
  const [poliList, setPoliList] = useState<Poli[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [tanggalFilter, setTanggalFilter] = useState(new Date().toISOString().split('T')[0])
  const [form, setForm] = useState({ pasien_id: '', dokter_id: '', poli_id: '' })

  async function fetchData() {
    setLoading(true)
    const [{ data: rows }, { data: pasiens }, { data: dokters }, { data: polis }] = await Promise.all([
      supabase
        .from('antrian')
        .select('*, pasien(nama), dokter(nama), poli(nama)')
        .eq('tanggal', tanggalFilter)
        .order('nomor_antrian', { ascending: true }),
      supabase.from('pasien').select('id, nama').order('nama'),
      supabase.from('dokter').select('id, nama, poli_id').order('nama'),
      supabase.from('poli').select('*').order('nama'),
    ])
    setData(rows || [])
    setPasienList((pasiens as any) || [])
    setDokterList((dokters as any) || [])
    setPoliList(polis || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [tanggalFilter])

  async function updateStatus(id: string, status: string) {
    await supabase.from('antrian').update({ status }).eq('id', id)
    fetchData()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Hitung nomor antrian berikutnya
    const { count } = await supabase
      .from('antrian')
      .select('*', { count: 'exact', head: true })
      .eq('tanggal', tanggalFilter)
    
    await supabase.from('antrian').insert({
      ...form,
      poli_id: form.poli_id || null,
      tanggal: tanggalFilter,
      nomor_antrian: (count || 0) + 1,
      status: 'menunggu',
    })
    setShowModal(false)
    setForm({ pasien_id: '', dokter_id: '', poli_id: '' })
    fetchData()
  }

  // Filter dokter berdasarkan poli yang dipilih
  const filteredDokter = form.poli_id
    ? dokterList.filter((d) => d.poli_id === form.poli_id)
    : dokterList

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Antrian</h1>
          <p className="text-gray-500 text-sm">Kelola antrian pasien</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Tambah Antrian</button>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium text-gray-700">Tanggal:</label>
          <input
            type="date"
            value={tanggalFilter}
            onChange={(e) => setTanggalFilter(e.target.value)}
            className="input-field max-w-[200px]"
          />
          <span className="text-sm text-gray-500">{data.length} antrian</span>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-8">Memuat...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Tidak ada antrian untuk tanggal ini.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">No.</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Pasien</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Poli</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Dokter</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-bold text-gray-900">{a.nomor_antrian}</td>
                    <td className="py-3 px-2 font-medium text-gray-900">{a.pasien?.nama || '-'}</td>
                    <td className="py-3 px-2 text-gray-600">{a.poli?.nama || '-'}</td>
                    <td className="py-3 px-2 text-gray-600">{a.dokter?.nama || '-'}</td>
                    <td className="py-3 px-2">
                      <span className={statusColors[a.status] || ''}>{a.status}</span>
                    </td>
                    <td className="py-3 px-2 text-right space-x-1">
                      {a.status === 'menunggu' && (
                        <button onClick={() => updateStatus(a.id, 'dipanggil')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                          Panggil
                        </button>
                      )}
                      {a.status === 'dipanggil' && (
                        <button onClick={() => updateStatus(a.id, 'selesai')} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
                          Selesai
                        </button>
                      )}
                      {(a.status === 'menunggu' || a.status === 'dipanggil') && (
                        <button onClick={() => updateStatus(a.id, 'batal')} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">
                          Batal
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Antrian Manual</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Pasien</label>
                <select className="input-field" required value={form.pasien_id} onChange={(e) => setForm({ ...form, pasien_id: e.target.value })}>
                  <option value="">-- Pilih Pasien --</option>
                  {pasienList.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Poli</label>
                <select className="input-field" value={form.poli_id} onChange={(e) => setForm({ ...form, poli_id: e.target.value, dokter_id: '' })}>
                  <option value="">-- Pilih Poli --</option>
                  {poliList.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Dokter</label>
                <select className="input-field" required value={form.dokter_id} onChange={(e) => setForm({ ...form, dokter_id: e.target.value })}>
                  <option value="">-- Pilih Dokter --</option>
                  {filteredDokter.map((d) => <option key={d.id} value={d.id}>{d.nama}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
                <button type="submit" className="btn-primary">Tambah</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
