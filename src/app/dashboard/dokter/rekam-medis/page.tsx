'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { RekamMedis, Pasien, Dokter } from '@/types'

export default function DokterRekamMedisPage() {
  const supabase = createClient()
  const [data, setData] = useState<RekamMedis[]>([])
  const [pasienList, setPasienList] = useState<Pasien[]>([])
  const [dokterList, setDokterList] = useState<Dokter[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    pasien_id: '', dokter_id: '', tanggal: new Date().toISOString().split('T')[0],
    keluhan: '', diagnosis: '', resep: '', catatan: ''
  })
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Auto-open modal jika ada pasien_id di URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const pasienIdParam = params.get('pasien_id')
      if (pasienIdParam) {
        setForm(prev => ({ ...prev, pasien_id: pasienIdParam }))
        setShowModal(true)
      }
    }
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)

    if (user) {
      setForm(prev => ({ ...prev, dokter_id: user.id }))
      const today = new Date().toISOString().split('T')[0]
      
      const [{ data: rows }, { data: antrians }, { data: dokters }] = await Promise.all([
        supabase.from('rekam_medis').select('*, pasien(nama), dokter(nama)').eq('dokter_id', user.id).order('tanggal', { ascending: false }),
        supabase.from('antrian').select('pasien_id, pasien(id, nama)').eq('dokter_id', user.id).eq('tanggal', today),
        supabase.from('dokter').select('id, nama').eq('id', user.id),
      ])
      
      // Ambil daftar pasien unik dari antrian hari ini
      const uniquePasiens = new Map()
      if (antrians) {
        antrians.forEach((a: any) => {
          if (a.pasien) uniquePasiens.set(a.pasien.id, a.pasien)
        })
      }
      
      // Jika pasien_id sudah diset via URL, pastikan pasien tersebut ada di list (meski antrian sudah berubah statusnya dll)
      // Namun karena requirement hanya antrean hari ini, seharusnya sudah tercover jika pasien masih ada di antrian.

      setData(rows || [])
      setPasienList(Array.from(uniquePasiens.values()))
      setDokterList((dokters as any) || [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Langsung insert tanpa status_resep
    const { data, error } = await supabase.from('rekam_medis').insert(form).select()
    
    if (error) {
      console.error("Supabase Insert Error:", error)
      alert(`Gagal menyimpan rekam medis: ${error.message}`)
      return
    }

    alert('Rekam medis berhasil disimpan!')
    setShowModal(false)
    setForm({ pasien_id: '', dokter_id: currentUser?.id || '', tanggal: new Date().toISOString().split('T')[0], keluhan: '', diagnosis: '', resep: '', catatan: '' })
    fetchData()
  }

  const filtered = data.filter((r) =>
    (r.pasien?.nama || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.diagnosis || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rekam Medis</h1>
          <p className="text-gray-500 text-sm">Kelola rekam medis pasien</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Input Rekam Medis</button>
      </div>

      <div className="card">
        <input
          type="text"
          placeholder="Cari nama pasien atau diagnosis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field mb-4 max-w-sm"
        />

        {loading ? (
          <p className="text-gray-500 text-center py-8">Memuat...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Tidak ada rekam medis.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Tanggal</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Pasien</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Dokter</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Keluhan</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-gray-600">{r.tanggal}</td>
                    <td className="py-3 px-2 font-medium text-gray-900">{r.pasien?.nama || '-'}</td>
                    <td className="py-3 px-2 text-gray-600">{r.dokter?.nama || '-'}</td>
                    <td className="py-3 px-2 text-gray-600 max-w-[200px] truncate">{r.keluhan}</td>
                    <td className="py-3 px-2 text-gray-600 max-w-[200px] truncate">{r.diagnosis}</td>
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Input Rekam Medis & Resep</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Pasien (Dari Antrean Hari Ini)</label>
                {pasienList.length === 0 ? (
                  <p className="text-sm text-red-500 py-2 border rounded px-3 bg-red-50 border-red-200">
                    Belum ada pasien yang mengambil antrean ke Anda hari ini.
                  </p>
                ) : (
                  <select className="input-field" required value={form.pasien_id} onChange={(e) => setForm({ ...form, pasien_id: e.target.value })}>
                    <option value="">-- Pilih Pasien di Antrean --</option>
                    {pasienList.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
                  </select>
                )}
              </div>
              <div>
                <label className="label">Dokter (Anda)</label>
                <select className="input-field" required value={form.dokter_id} onChange={(e) => setForm({ ...form, dokter_id: e.target.value })}>
                  <option value="">-- Pilih Dokter --</option>
                  {dokterList.map((d) => <option key={d.id} value={d.id}>{d.nama}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Tanggal</label>
                <input type="date" className="input-field" required value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
              </div>
              <div>
                <label className="label">Keluhan</label>
                <textarea className="input-field" rows={2} required value={form.keluhan} onChange={(e) => setForm({ ...form, keluhan: e.target.value })} />
              </div>
              <div>
                <label className="label">Diagnosis</label>
                <textarea className="input-field" rows={2} required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
              </div>
              <div>
                <label className="label">Resep Obat</label>
                <textarea className="input-field" rows={2} placeholder="Contoh: Paracetamol 3x1" value={form.resep} onChange={(e) => setForm({ ...form, resep: e.target.value })} />
              </div>
              <div>
                <label className="label">Catatan Tambahan</label>
                <textarea className="input-field" rows={2} value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} />
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
