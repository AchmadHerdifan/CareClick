import { createServerSupabaseClient } from '@/lib/supabase-server'
import SidebarUser from '@/components/layout/SidebarUser'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <DashboardLayout
      sidebar={<SidebarUser userEmail={user?.email ?? ''} />}
      bgClassName="bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-100"
    >
      {children}
    </DashboardLayout>
  )
}
