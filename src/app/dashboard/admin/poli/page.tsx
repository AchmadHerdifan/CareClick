'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Poli } from '@/types'

export default function PoliPage() {
  const supabase = createClient()
  const [data, setData] = useState<Poli[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ nama: '', keterangan: '' })

  async function fetchData() {
    setLoading(true)
    const { data: rows } = await supabase.from('poli').select('*').order('nama')
    setData(rows || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function openAdd() {
    setEditId(null)
    setForm({ nama: '', keterangan: '' })
    setShowModal(true)
  }

  function openEdit(p: Poli) {
    setEditId(p.id)
    setForm({ nama: p.nama, keterangan: p.keterangan })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editId) {
      await supabase.from('poli').update(form).eq('id', editId)
    } else {
      await supabase.from('poli').insert(form)
    }
    setShowModal(false)
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin hapus poli ini?')) return
    await supabase.from('poli').delete().eq('id', id)
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Poli</h1>
          <p className="text-gray-500 text-sm">Kelola poli klinik</p>
        </div>
        <button onClick={openAdd} className="btn-primary">+ Tambah Poli</button>
      </div>

      <div className="card">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Memuat...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Tidak ada data poli.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((p) => (
              <div key={p.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{p.nama}</h3>
                    <p className="text-sm text-gray-500 mt-1">{p.keterangan || 'Tidak ada keterangan'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-xs">Hapus</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editId ? 'Edit Poli' : 'Tambah Poli'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Nama Poli</label>
                <input className="input-field" required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div>
                <label className="label">Keterangan</label>
                <textarea className="input-field" rows={3} value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} />
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
