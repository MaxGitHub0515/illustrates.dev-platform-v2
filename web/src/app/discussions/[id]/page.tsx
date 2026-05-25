import type { Metadata } from 'next'
import { Nav }    from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { DiscussionDetail } from '@/components/features/discussions/DiscussionDetail'

export const metadata: Metadata = {
  title: 'Discussion',
}

export default function DiscussionPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Nav />
      <main><DiscussionDetail id={params.id} /></main>
      <Footer />
    </>
  )
}
