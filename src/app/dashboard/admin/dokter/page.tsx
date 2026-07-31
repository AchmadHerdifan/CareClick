'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Dokter, Poli, JadwalDokter } from '@/types'

const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu', 'Setiap Hari'] as const

interface DokterFormState {
  nama: string
  spesialisasi: string
  no_str: string
  poli_id: string
  jadwal: JadwalDokter[]
}

const emptyForm: DokterFormState = {
  nama: '', spesialisasi: '', no_str: '', poli_id: '', jadwal: [],
}

export default function DokterPage() {
  const supabase = createClient()
  const [data, setData] = useState<Dokter[]>([])
  const [poliList, setPoliList] = useState<Poli[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<DokterFormState>(emptyForm)

  async function fetchData() {
    setLoading(true)
    const [{ data: dokters }, { data: polis }] = await Promise.all([
      supabase.from('dokter').select('*, poli(nama)').order('created_at', { ascending: false }),
      supabase.from('poli').select('*').order('nama'),
    ])
    setData(dokters || [])
    setPoliList(polis || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function openAdd() {
    setEditId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(d: Dokter) {
    setEditId(d.id)
    setForm({
      nama: d.nama, spesialisasi: d.spesialisasi, no_str: d.no_str,
      poli_id: d.poli_id || '', jadwal: d.jadwal || [],
    })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      nama: form.nama,
      spesialisasi: form.spesialisasi,
      no_str: form.no_str,
      poli_id: form.poli_id || null,
      jadwal: form.jadwal,
    }
    if (editId) {
      await supabase.from('dokter').update(payload).eq('id', editId)
    } else {
      await supabase.from('dokter').insert(payload)
    }
    setShowModal(false)
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin hapus data dokter ini?')) return
    await supabase.from('dokter').delete().eq('id', id)
    fetchData()
  }

  function addJadwal() {
    setForm({
      ...form,
      jadwal: [...form.jadwal, { hari: 'Senin', jam_mulai: '08:00', jam_selesai: '12:00' }],
    })
  }

  function removeJadwal(idx: number) {
    setForm({ ...form, jadwal: form.jadwal.filter((_, i) => i !== idx) })
  }

  function updateJadwal(idx: number, field: keyof JadwalDokter, value: string) {
    const updated = [...form.jadwal]
    updated[idx] = { ...updated[idx], [field]: value }
    setForm({ ...form, jadwal: updated })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Dokter</h1>
          <p className="text-gray-500 text-sm">Kelola data dokter dan jadwal praktik</p>
        </div>
        <button onClick={openAdd} className="btn-primary">+ Tambah Dokter</button>
      </div>

      <div className="card">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Memuat...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Tidak ada data dokter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Nama</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Spesialisasi</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">No. STR</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Poli</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Jadwal</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d) => (
                  <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-900">{d.nama}</td>
                    <td className="py-3 px-2 text-gray-600">{d.spesialisasi}</td>
                    <td className="py-3 px-2 text-gray-600">{d.no_str}</td>
                    <td className="py-3 px-2 text-gray-600">{d.poli?.nama || '-'}</td>
                    <td className="py-3 px-2 text-gray-600 text-xs">
                      {(d.jadwal || []).map((j, i) => (
                        <span key={i} className="inline-block bg-gray-100 rounded px-1.5 py-0.5 mr-1 mb-1">
                          {j.hari} {j.jam_mulai}-{j.jam_selesai}
                        </span>
                      ))}
                    </td>
                    <td className="py-3 px-2 text-right space-x-2">
                      <button onClick={() => openEdit(d)} className="text-blue-600 hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:underline text-xs">Hapus</button>
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editId ? 'Edit Dokter' : 'Tambah Dokter'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Nama</label>
                <input className="input-field" required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div>
                <label className="label">Spesialisasi</label>
                <input className="input-field" required value={form.spesialisasi} onChange={(e) => setForm({ ...form, spesialisasi: e.target.value })} />
              </div>
              <div>
                <label className="label">No. STR</label>
                <input className="input-field" required value={form.no_str} onChange={(e) => setForm({ ...form, no_str: e.target.value })} />
              </div>
              <div>
                <label className="label">Poli</label>
                <select className="input-field" value={form.poli_id} onChange={(e) => setForm({ ...form, poli_id: e.target.value })}>
                  <option value="">-- Pilih Poli --</option>
                  {poliList.map((p) => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Jadwal Praktik</label>
                  <button type="button" onClick={addJadwal} className="text-xs text-blue-600 hover:underline">+ Tambah Jadwal</button>
                </div>
                {form.jadwal.map((j, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <select className="input-field text-xs" value={j.hari} onChange={(e) => updateJadwal(idx, 'hari', e.target.value)}>
                      {hariList.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <input type="time" className="input-field text-xs" value={j.jam_mulai} onChange={(e) => updateJadwal(idx, 'jam_mulai', e.target.value)} />
                    <span className="text-gray-400">-</span>
                    <input type="time" className="input-field text-xs" value={j.jam_selesai} onChange={(e) => updateJadwal(idx, 'jam_selesai', e.target.value)} />
                    <button type="button" onClick={() => removeJadwal(idx)} className="text-red-500 text-xs hover:underline">✕</button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
                <button type="submit" className="btn-primary">{editId ? 'Simpan' : 'Tambah'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
