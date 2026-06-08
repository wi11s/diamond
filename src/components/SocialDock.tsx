'use client'

import { Instagram, Mail } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function SocialDock() {
  const pathname = usePathname()

  if (pathname === '/scroll') return null

  return (
    <div className="invert-blend auto-hide fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href="mailto:taylor.diamond10@gmail.com"
        aria-label="Email Taylor Diamond"
      >
        <Mail size={20} />
      </a>
      <a
        href="https://www.instagram.com/its_taylor_diamond/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram @its_taylor_diamond"
      >
        <Instagram size={20} />
      </a>
    </div>
  )
}
