import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function RekamMedisUserPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  let { data: rekamMedis, error } = await supabase
    .from('rekam_medis')
    .select('*, dokter(nama)')
    .eq('pasien_id', user.id)
    .order('tanggal', { ascending: false })

  if (error) {
    console.error("Supabase Select Error:", error)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Error Mengambil Data</h1>
        <p className="text-gray-800 bg-red-50 p-4 rounded-lg border border-red-200">
          Gagal mengambil rekam medis: {error.message}
        </p>
      </div>
    )
  }

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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
