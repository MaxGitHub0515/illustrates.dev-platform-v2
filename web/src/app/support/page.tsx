import type { Metadata } from 'next'
import { Nav }    from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { SupportForm } from '@/components/features/support/SupportForm'

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get in touch — bugs, collaborations, questions.',
}

export default function SupportPage() {
  return (
    <>
      <Nav />
      <main style={{ background:'linear-gradient(180deg,#060412,#08051c)', minHeight:'70vh', padding:'56px 28px' }}>
        <div style={{ maxWidth:600, margin:'0 auto' }}>
          <p style={{ fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:500, marginBottom:8, background:'linear-gradient(90deg,#6366f1,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Contact</p>
          <h1 style={{ fontSize:26, fontWeight:500, color:'#f0f4ff', letterSpacing:'-0.03em', marginBottom:6 }}>Get in touch</h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:36, lineHeight:1.65 }}>Open to freelance, contracts, collaborations, and questions. I reply within 24h.</p>
          <SupportForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
