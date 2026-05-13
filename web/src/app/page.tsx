import { auth }          from '@clerk/nextjs/server'
import { redirect }      from 'next/navigation'
import { Nav }           from '@/components/landing/Nav'
import { Hero }          from '@/components/landing/Hero'
import { SelectedWork }  from '@/components/landing/SelectedWork'
import { Writing }       from '@/components/landing/Writing'
import { About }         from '@/components/landing/About'
import { Contact }       from '@/components/landing/Contact'
import { Footer }        from '@/components/landing/Footer'
import { serverList }    from '@/lib/api/server'
import type { ApiProject, ApiPost } from '@/types/api'

function Divider({ type }: { type: 'primary'|'warm'|'green'|'violet' }) {
  const cls = { primary:'div-primary', warm:'div-warm', green:'div-green', violet:'div-violet' }[type]
  return <div className={`section-divider ${cls}`} aria-hidden="true" />
}

export default async function LandingPage() {
  const { userId, sessionClaims } = await auth()
  if (userId && (sessionClaims?.publicMetadata as { role?: string })?.role === 'admin') {
    redirect('/admin')
  }

  // Fetch real data server-side (60s revalidation)
  const [projectsRes, postsRes] = await Promise.all([
    serverList<ApiProject>('/projects?status=published&sort=createdAt&order=desc&limit=3'),
    serverList<ApiPost>('/blog?status=published&sort=createdAt&order=desc&limit=3'),
  ])

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Divider type="primary" />
        <SelectedWork projects={projectsRes.data} />
        <Divider type="warm" />
        <Writing posts={postsRes.data} />
        <Divider type="green" />
        <About />
        <Divider type="violet" />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
