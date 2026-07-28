'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Obat } from '@/types'

export default function MasterObatPage() {
  const supabase = createClient()
  const [data, setData] = useState<Obat[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ nama_obat: '', harga: 0, stok: 0 })

  async function fetchData() {
    setLoading(true)
    const { data: obat } = await supabase.from('obat').select('*').order('nama_obat')
    setData(obat || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('obat').insert(form)
    setShowModal(false)
    setForm({ nama_obat: '', harga: 0, stok: 0 })
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin hapus obat ini?')) return
    await supabase.from('obat').delete().eq('id', id)
    fetchData()
  }

  const filtered = data.filter((o) =>
    o.nama_obat.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Obat</h1>
          <p className="text-gray-500 text-sm">Kelola data obat dan harga</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Tambah Obat</button>
      </div>

      <div className="card">
        <input
          type="text"
          placeholder="Cari obat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field mb-4 max-w-sm"
        />

        {loading ? (
          <p className="text-gray-500 text-center py-8">Memuat...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Tidak ada data obat.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Nama Obat</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Harga</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Stok</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-900">{o.nama_obat}</td>
                    <td className="py-3 px-2 text-gray-600">Rp {o.harga.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-2 text-gray-600">{o.stok}</td>
                    <td className="py-3 px-2 text-right">
                      <button onClick={() => handleDelete(o.id)} className="text-red-600 hover:underline text-xs">Hapus</button>
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Obat</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Nama Obat</label>
                <input type="text" className="input-field" required value={form.nama_obat} onChange={(e) => setForm({ ...form, nama_obat: e.target.value })} />
              </div>
              <div>
                <label className="label">Harga (Rp)</label>
                <input type="number" className="input-field" required value={form.harga} onChange={(e) => setForm({ ...form, harga: Number(e.target.value) })} />
              </div>
              <div>
                <label className="label">Stok Awal</label>
                <input type="number" className="input-field" required value={form.stok} onChange={(e) => setForm({ ...form, stok: Number(e.target.value) })} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
                <button type="submit" className="btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
