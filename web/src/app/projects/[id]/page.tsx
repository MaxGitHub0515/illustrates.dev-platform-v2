import type { Metadata } from 'next'
import { notFound }  from 'next/navigation'
import { Nav }       from '@/components/landing/Nav'
import { Footer }    from '@/components/landing/Footer'
import { serverGet } from '@/lib/api/server'
import type { ApiProject } from '@/types/api'
import { ProjectDetail } from '@/components/features/projects/ProjectDetail'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const p = await serverGet<ApiProject>(`/projects/${id}`)
  if (!p) return { title: 'Project not found' }
  return { title: p.title, description: p.description }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const project = await serverGet<ApiProject>(`/projects/${id}`, 60)
  if (!project) notFound()
  return (
    <>
      <Nav />
      <main><ProjectDetail project={project} /></main>
      <Footer />
    </>
  )
}
