import type { Metadata } from 'next'
import { Nav }    from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { DiscussionsClient } from '@/components/features/discussions/DiscussionsClient'

export const metadata: Metadata = {
  title: 'Discussions',
  description: 'Ask questions, share ideas, and discuss projects.',
}

export default function DiscussionsPage() {
  return (
    <>
      <Nav />
      <main><DiscussionsClient /></main>
      <Footer />
    </>
  )
}
