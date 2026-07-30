import { createServerSupabaseClient } from '@/lib/supabase-server'
import SidebarAdmin from '@/components/layout/SidebarAdmin'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <DashboardLayout
      sidebar={<SidebarAdmin userEmail={user?.email ?? ''} />}
    >
      {children}
    </DashboardLayout>
  )
}
