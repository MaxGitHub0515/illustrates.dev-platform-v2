import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect }          from 'next/navigation'
import { AdminSidebar }      from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const user = await currentUser()
  const role = user?.publicMetadata?.role as string | undefined
  if (role !== 'admin') redirect('/unauthorized')

  return (
    <div className="flex min-h-screen" style={{ background:'#070518' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto min-w-0 pt-12 md:pt-0"
            style={{ background:'linear-gradient(135deg,#070518 0%,#090620 100%)' }}>
        {children}
      </main>
    </div>
  )
}
