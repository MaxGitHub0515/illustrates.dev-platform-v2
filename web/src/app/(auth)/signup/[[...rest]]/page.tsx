import type { Metadata } from 'next'
import { SignUp } from '@clerk/nextjs'
import { AuthShell } from '@/components/auth/AuthShell'
import { clerkAppearance } from '@/components/auth/clerkAppearance'

export const metadata: Metadata = { title: 'Get started' }

export default function SignUpPage() {
  return (
    <AuthShell
      heading="Join illustrates.dev"
      subheading="Free forever. No credit card needed."
      switchText="Already have an account?"
      switchLabel="Sign in"
      switchHref="/login"
    >
      {/*
        Phone number note:
        If you see "Phone numbers from this country are not supported",
        go to Clerk Dashboard → Configure → User & Authentication →
        Phone number → set to "Optional" or disable it entirely.
        Use email verification instead — it works everywhere.
      */}
      <SignUp
        appearance={clerkAppearance}
        fallbackRedirectUrl="/"
        signInUrl="/login"
        /*
         * Unsupported-country phone issue workaround:
         * The phone field is controlled by Clerk Dashboard, not here.
         * Set it to Optional or Off in:
         * dashboard.clerk.com → Configure → User & Authentication → Phone number
         */
      />
    </AuthShell>
  )
}
