import type { Metadata } from 'next'
import { SignIn } from '@clerk/nextjs'
import { AuthShell } from '@/components/auth/AuthShell'
import { clerkAppearance } from '@/components/auth/clerkAppearance'

export const metadata: Metadata = { title: 'Sign in' }

export default function LoginPage() {
  return (
    <AuthShell
      heading="Welcome back"
      subheading="Sign in to continue to illustrates.dev"
      switchText="Don't have an account?"
      switchLabel="Get started free"
      switchHref="/signup"
    >
      <SignIn
        appearance={clerkAppearance}
        fallbackRedirectUrl="/"
        signUpUrl="/signup"
      />
    </AuthShell>
  )
}
