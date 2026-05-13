import type { Metadata, Viewport } from 'next'
import { ClerkProvider }   from '@clerk/nextjs'
import { ThemeProvider }   from '@/components/theme/ThemeProvider'
import { AccentProvider }  from '@/components/theme/AccentProvider'
import { QueryProvider }   from '@/components/providers/QueryProvider'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist     = Geist    ({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })

export const viewport: Viewport = { themeColor: '#060412' }
export const metadata: Metadata = {
  title:       { default: 'illustrates.dev', template: '%s · illustrates.dev' },
  description: 'Full-stack developer focused on distributed systems, APIs, and infrastructure.',
}

const INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('illustrates-theme')||'dark';document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
          <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
        </head>
        <body className={`${geist.variable} ${geistMono.variable}`}>
          <QueryProvider>
            <ThemeProvider>
              <AccentProvider>
                {children}
              </AccentProvider>
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
