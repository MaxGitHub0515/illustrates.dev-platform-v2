import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/login?redirect_url=/dashboard')
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,#07041a,#060412)' }}>
      <DashboardNav />
      <main style={{ maxWidth:900, margin:'0 auto', padding:'32px 24px' }}>
        {children}
      </main>
    </div>
  )
}
