import type { Metadata } from 'next'
import { Nav }       from '@/components/landing/Nav'
import { Footer }    from '@/components/landing/Footer'
import { AboutPage } from '@/components/about/AboutPage'

export const metadata: Metadata = {
  title: 'About',
  description: 'Full-stack developer focused on distributed systems, APIs, and infrastructure.',
}

export default function About() {
  return (
    <>
      <Nav />
      <main><AboutPage /></main>
      <Footer />
    </>
  )
}
