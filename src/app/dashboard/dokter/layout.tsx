import { createServerSupabaseClient } from '@/lib/supabase-server'
import SidebarDokter from '@/components/layout/SidebarDokter'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default async function DokterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <DashboardLayout
      sidebar={<SidebarDokter userEmail={user?.email ?? ''} />}
    >
      {children}
    </DashboardLayout>
  )
}
