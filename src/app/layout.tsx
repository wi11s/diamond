import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Taylor Diamond - Portfolio',
  description: 'Photographer, creative, and storyteller. Explore my work.',
  keywords: 'photography, portfolio, creative, blog, Taylor Diamond',
  authors: [{ name: 'Taylor Diamond' }],
  openGraph: {
    title: 'Taylor Diamond - Portfolio',
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
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}