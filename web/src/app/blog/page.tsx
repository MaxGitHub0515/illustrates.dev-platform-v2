import type { Metadata } from 'next'
import { Nav }      from '@/components/landing/Nav'
import { Footer }   from '@/components/landing/Footer'
import { BlogList } from '@/components/blog/BlogList'

export const metadata: Metadata = { title:'Writing', description:'Build logs, deep dives, and technical writing.' }

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main><BlogList /></main>
      <Footer />
    </>
  )
}
