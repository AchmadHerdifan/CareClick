import { createServerSupabaseClient } from '@/lib/supabase-server'
import SidebarUser from '@/components/layout/SidebarUser'

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Middleware sudah menjaga — di sini cukup render layout
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarUser userEmail={user?.email ?? ''} />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
