import { createServerSupabaseClient } from '@/lib/supabase-server'
import SidebarDokter from '@/components/layout/SidebarDokter'

export default async function DokterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDokter userEmail={user?.email ?? ''} />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
