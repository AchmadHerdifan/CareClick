import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function RekamMedisUserPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: rekamMedis } = await supabase
    .from('rekam_medis')
    .select('*, dokter(nama), resep_obat(*, obat(nama_obat))')
    .eq('pasien_id', user.id)
    .order('tanggal', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Rekam Medis Saya</h1>
      <p className="text-gray-500 mb-6">Riwayat pemeriksaan dan rekam medis Anda</p>

      {!rekamMedis || rekamMedis.length === 0 ? (
        <div className="card">
          <p className="text-gray-500 text-center py-8">Belum ada riwayat rekam medis.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rekamMedis.map((rm) => (
            <div key={rm.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{rm.tanggal}</p>
                  <p className="text-sm text-blue-600">{rm.dokter?.nama || 'Dokter tidak diketahui'}</p>
                </div>
                {rm.status_resep && (
                  <span className={`px-2 py-1 text-xs rounded ${rm.status_resep === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    Resep: {rm.status_resep}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 mb-1">Keluhan</p>
                  <p className="text-gray-900">{rm.keluhan || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 mb-1">Diagnosis</p>
                  <p className="text-gray-900">{rm.diagnosis || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
                  <p className="text-gray-500 mb-1">Resep Dokter</p>
                  <p className="text-gray-900">{rm.resep || '-'}</p>
                </div>
                {rm.catatan && (
                  <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
                    <p className="text-gray-500 mb-1">Catatan</p>
                    <p className="text-gray-900">{rm.catatan}</p>
                  </div>
                )}
              </div>

              {rm.status_resep === 'selesai' && rm.resep_obat && rm.resep_obat.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Rincian Obat & Biaya (Apotek)</p>
                  <div className="bg-amber-50 rounded-lg p-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-amber-200">
                          <th className="text-left py-1 text-amber-900 font-medium">Obat</th>
                          <th className="text-center py-1 text-amber-900 font-medium">Qty</th>
                          <th className="text-right py-1 text-amber-900 font-medium">Harga</th>
                          <th className="text-right py-1 text-amber-900 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rm.resep_obat.map((item: any) => (
                          <tr key={item.id} className="border-b border-amber-100/50">
                            <td className="py-2 text-amber-900">{item.obat?.nama_obat || '-'}</td>
                            <td className="py-2 text-amber-900 text-center">{item.jumlah}</td>
                            <td className="py-2 text-amber-900 text-right">Rp {item.harga_satuan.toLocaleString('id-ID')}</td>
                            <td className="py-2 text-amber-900 text-right font-medium">Rp {item.total_harga.toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={3} className="py-2 text-right font-bold text-amber-900">Total Biaya Obat:</td>
                          <td className="py-2 text-right font-bold text-amber-900">
                            Rp {rm.resep_obat.reduce((acc: number, curr: any) => acc + curr.total_harga, 0).toLocaleString('id-ID')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
