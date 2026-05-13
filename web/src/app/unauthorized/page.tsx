import Link from 'next/link'
import { SignOutButton } from '@clerk/nextjs'

export default function UnauthorizedPage() {
  return (
    <main style={{
      minHeight: '100vh', background: '#060412',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{
          width: 60, height: 60, borderRadius: 16, margin: '0 auto 20px',
          background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className="ti ti-shield-x" style={{ fontSize: 28, color: '#ef4444' }} aria-hidden="true" />
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 500, color: '#f0f4ff', marginBottom: 8 }}>
          Access restricted
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 24 }}>
          Studio access requires admin privileges. If you believe this is an error, contact the platform owner.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 7,
            border: '0.5px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13,
          }}>
            ← Back to home
          </Link>
          <SignOutButton redirectUrl="/login">
            <button style={{
              padding: '8px 18px', borderRadius: 7, cursor: 'pointer', fontSize: 13,
              background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.25)',
              color: '#ef4444',
            }}>
              Sign out
            </button>
          </SignOutButton>
        </div>

        <p style={{ marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
          Error code: <code style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 3 }}>403</code>
        </p>
      </div>
    </main>
  )
}
