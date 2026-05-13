import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav }    from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="bg-[var(--bg-base)] min-h-[80vh] px-6 py-16">
        <div className="max-w-[680px] mx-auto">
          <Link href="/" className="text-[12px] text-[var(--text-3)] no-underline hover:text-[var(--text-1)] mb-8 block">← Home</Link>
          <h1 className="text-[26px] font-medium text-[var(--text-1)] tracking-tight mb-6">Privacy Policy</h1>
          <p className="text-[14px] text-[var(--text-2)] leading-relaxed mb-4">
            We collect only the information needed to provide this service — your email address and username via Clerk authentication. We do not sell or share your data with third parties. Analytics are anonymous.
          </p>
          <p className="text-[12px] text-[var(--text-3)] mt-8">Last updated: 2025.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
