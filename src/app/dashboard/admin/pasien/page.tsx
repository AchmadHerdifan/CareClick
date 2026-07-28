'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Pasien, PasienForm } from '@/types'

const emptyForm: PasienForm = {
  nama: '', nik: '', tanggal_lahir: '', jenis_kelamin: 'L', alamat: '', no_telepon: '',
}

export default function PasienPage() {
  const supabase = createClient()
  const [data, setData] = useState<Pasien[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<PasienForm>(emptyForm)
  const [search, setSearch] = useState('')

  async function fetchData() {
    setLoading(true)
    const { data: rows } = await supabase
      .from('pasien')
      .select('*')
      .order('created_at', { ascending: false })
    setData(rows || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function openAdd() {
    setEditId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(p: Pasien) {
    setEditId(p.id)
    setForm({
      nama: p.nama, nik: p.nik, tanggal_lahir: p.tanggal_lahir,
      jenis_kelamin: p.jenis_kelamin, alamat: p.alamat, no_telepon: p.no_telepon,
    })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editId) {
      await supabase.from('pasien').update(form).eq('id', editId)
    } else {
      await supabase.from('pasien').insert(form)
    }
    setShowModal(false)
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin hapus data pasien ini?')) return
    await supabase.from('pasien').delete().eq('id', id)
    fetchData()
  }

  const filtered = data.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.nik.includes(search)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Pasien</h1>
          <p className="text-gray-500 text-sm">Kelola data pasien klinik</p>
        </div>
        <button onClick={openAdd} className="btn-primary">+ Tambah Pasien</button>
      </div>

      <div className="card">
        <input
          type="text"
          placeholder="Cari nama atau NIK..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field mb-4 max-w-sm"
        />

        {loading ? (
          <p className="text-gray-500 text-center py-8">Memuat...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Tidak ada data pasien.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Nama</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">NIK</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Tgl Lahir</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">JK</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">No. Telp</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-900">{p.nama}</td>
                    <td className="py-3 px-2 text-gray-600">{p.nik}</td>
                    <td className="py-3 px-2 text-gray-600">{p.tanggal_lahir}</td>
                    <td className="py-3 px-2 text-gray-600">{p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                    <td className="py-3 px-2 text-gray-600">{p.no_telepon}</td>
                    <td className="py-3 px-2 text-right space-x-2">
                      <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-xs">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editId ? 'Edit Pasien' : 'Tambah Pasien'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Nama</label>
                <input className="input-field" required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div>
                <label className="label">NIK</label>
                <input className="input-field" required value={form.nik} onChange={(e) => setForm({ ...form, nik: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Tanggal Lahir</label>
                  <input type="date" className="input-field" required value={form.tanggal_lahir} onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })} />
                </div>
                <div>
                  <label className="label">Jenis Kelamin</label>
                  <select className="input-field" value={form.jenis_kelamin} onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value as 'L' | 'P' })}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Alamat</label>
                <textarea className="input-field" rows={2} value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
              </div>
              <div>
                <label className="label">No. Telepon</label>
                <input className="input-field" value={form.no_telepon} onChange={(e) => setForm({ ...form, no_telepon: e.target.value })} />
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
