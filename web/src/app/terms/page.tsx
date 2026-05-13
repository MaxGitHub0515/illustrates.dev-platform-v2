import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav }    from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="bg-[var(--bg-base)] min-h-[80vh] px-6 py-16">
        <div className="max-w-[680px] mx-auto">
          <Link href="/" className="text-[12px] text-[var(--text-3)] no-underline hover:text-[var(--text-1)] mb-8 block">← Home</Link>
          <h1 className="text-[26px] font-medium text-[var(--text-1)] tracking-tight mb-6">Terms of Service</h1>
          <p className="text-[14px] text-[var(--text-2)] leading-relaxed mb-4">
            illustrates.dev is a personal portfolio platform. By using this site you agree to use it responsibly and not attempt to gain unauthorised access to any part of the system.
          </p>
          <p className="text-[12px] text-[var(--text-3)] mt-8">Last updated: 2025.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
