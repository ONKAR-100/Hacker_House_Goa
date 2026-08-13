import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Baloo_2, Inter, Caveat } from 'next/font/google'
import { GoaTimeProvider } from '@/components/goa-time-provider'
import './globals.css'

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})
const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-signature',
})

export const metadata: Metadata = {
  title: 'HH Goa 2026 — Builder ID Generator',
  description:
    'Build your festival ID card for HH Goa 2026. Upload your photo, pick a frame, stack your badges, and ship your Builder ID — Solo, Duo, or Trio. Code. Coconuts. Chaos.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F2F9F6',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${baloo.variable} ${inter.variable} ${caveat.variable}`}>
      <body className="antialiased font-sans">
        <GoaTimeProvider>{children}</GoaTimeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
