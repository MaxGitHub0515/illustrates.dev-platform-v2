import type { Metadata } from 'next'
import { Nav }    from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { DiscussionDetail } from '@/components/features/discussions/DiscussionDetail'

export const metadata: Metadata = {
  title: 'Discussion',
}

export default async function DiscussionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <>
      <Nav />
      <main><DiscussionDetail id={id} /></main>
      <Footer />
    </>
  )
}