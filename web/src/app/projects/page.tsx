import type { Metadata } from 'next'
import { Nav }           from '@/components/landing/Nav'
import { Footer }        from '@/components/landing/Footer'
import { ProjectsClient } from '@/components/projects/ProjectsClient'

export const metadata: Metadata = { title:'Projects', description:'Backend systems, full-stack apps, CLI tools, and npm packages.' }

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main><ProjectsClient /></main>
      <Footer />
    </>
  )
}
