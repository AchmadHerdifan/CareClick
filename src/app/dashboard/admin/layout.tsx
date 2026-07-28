import { createServerSupabaseClient } from '@/lib/supabase-server'
import SidebarAdmin from '@/components/layout/SidebarAdmin'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Middleware sudah menjaga — di sini cukup render layout
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin userEmail={user?.email ?? ''} />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
