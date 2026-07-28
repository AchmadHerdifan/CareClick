'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { RekamMedis, Obat } from '@/types'

export default function ResepApotekerPage() {
  const supabase = createClient()
  const [data, setData] = useState<RekamMedis[]>([])
  const [obatList, setObatList] = useState<Obat[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedRekamMedis, setSelectedRekamMedis] = useState<RekamMedis | null>(null)
  
  // State for form
  const [resepItems, setResepItems] = useState<{ obat_id: string, jumlah: number }[]>([])

  async function fetchData() {
    setLoading(true)
    const [{ data: rows }, { data: obat }] = await Promise.all([
      supabase
        .from('rekam_medis')
        .select('*, pasien(nama), dokter(nama)')
        .not('resep', 'is', null)
        .order('tanggal', { ascending: false }),
      supabase.from('obat').select('*').order('nama_obat')
    ])
    setData(rows || [])
    setObatList(obat || [])
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function handleProsesClick(rm: RekamMedis) {
    setSelectedRekamMedis(rm)
    setResepItems([{ obat_id: '', jumlah: 1 }])
    setShowModal(true)
  }

  function handleAddItem() {
    setResepItems([...resepItems, { obat_id: '', jumlah: 1 }])
  }

  function handleRemoveItem(index: number) {
    const newItems = [...resepItems]
    newItems.splice(index, 1)
    setResepItems(newItems)
  }

  function handleChangeItem(index: number, field: string, value: any) {
    const newItems = [...resepItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setResepItems(newItems)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedRekamMedis) return

    // Insert all resep items
    const inserts = resepItems.filter(item => item.obat_id).map(item => {
      const obat = obatList.find(o => o.id === item.obat_id)
      const harga_satuan = obat?.harga || 0
      const total_harga = harga_satuan * item.jumlah
      return {
        rekam_medis_id: selectedRekamMedis.id,
        obat_id: item.obat_id,
        jumlah: item.jumlah,
        harga_satuan,
        total_harga
      }
    })

    if (inserts.length > 0) {
      await supabase.from('resep_obat').insert(inserts)
    }

    // Update status rekam medis
    await supabase.from('rekam_medis')
      .update({ status_resep: 'selesai' })
      .eq('id', selectedRekamMedis.id)

    setShowModal(false)
    setSelectedRekamMedis(null)
    setResepItems([])
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resep & Obat</h1>
          <p className="text-gray-500 text-sm">Proses resep dari dokter</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Memuat...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada resep dari dokter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Tanggal</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Pasien</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Dokter</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Catatan Resep Dokter</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-gray-600">{r.tanggal}</td>
                    <td className="py-3 px-2 font-medium text-gray-900">{r.pasien?.nama || '-'}</td>
                    <td className="py-3 px-2 text-gray-600">{r.dokter?.nama || '-'}</td>
                    <td className="py-3 px-2 text-gray-600 max-w-[250px] whitespace-pre-wrap">{r.resep}</td>
                    <td className="py-3 px-2 text-gray-600">
                      <span className={`px-2 py-1 text-xs rounded ${r.status_resep === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {r.status_resep}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      {r.status_resep === 'menunggu' && (
                        <button onClick={() => handleProsesClick(r)} className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 font-semibold">
                          Proses Resep
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

      {showModal && selectedRekamMedis && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Proses Resep Pasien</h2>
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg mb-4 text-sm">
              <p className="font-semibold text-amber-900 mb-1">Catatan Resep Dokter:</p>
              <p className="text-amber-800 whitespace-pre-wrap">{selectedRekamMedis.resep || '-'}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                <label className="label">Rincian Obat (Pilih dari Master Obat)</label>
                {resepItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <select 
                        className="input-field" 
                        required 
                        value={item.obat_id} 
                        onChange={(e) => handleChangeItem(index, 'obat_id', e.target.value)}
                      >
                        <option value="">-- Pilih Obat --</option>
                        {obatList.map((o) => <option key={o.id} value={o.id}>{o.nama_obat} - Rp {o.harga.toLocaleString('id-ID')}</option>)}
                      </select>
                    </div>
                    <div className="w-24">
                      <input 
                        type="number" 
                        min="1"
                        className="input-field" 
                        required 
                        value={item.jumlah} 
                        onChange={(e) => handleChangeItem(index, 'jumlah', Number(e.target.value))} 
                        placeholder="Qty"
                      />
                    </div>
                    <button type="button" onClick={() => handleRemoveItem(index)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg">
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddItem} className="text-sm text-blue-600 font-semibold hover:underline">+ Tambah Obat Lain</button>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-auto">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
                <button type="submit" className="btn-primary">Simpan & Selesai</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
