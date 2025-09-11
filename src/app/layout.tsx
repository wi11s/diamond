import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import SocialDock from '@/components/SocialDock'
import UsageNotice from '@/components/UsageNotice'
import InactivityHide from '@/components/InactivityHide'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Taylor Diamond',
  description: 'Photographer, creative, and storyteller. Explore my work.',
  keywords: 'photography, portfolio, creative, blog, Taylor Diamond',
  authors: [{ name: 'Taylor Diamond', url: 'https://www.instagram.com/its_taylor_diamond/' }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📸</text></svg>",
  },
  openGraph: {
    title: 'Taylor Diamond',
    description: 'Photographer, creative, and storyteller. Explore my work.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InactivityHide />
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <UsageNotice />
        <SocialDock />
      </body>
    </html>
  )
}
