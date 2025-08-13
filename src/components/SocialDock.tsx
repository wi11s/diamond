'use client'

import { Instagram, Mail } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function SocialDock() {
  const pathname = usePathname()
  const isBlogList = pathname === '/blog'
  const linkColor = isBlogList ? 'text-black hover:text-black/70' : 'text-white hover:text-white/80'

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      <a
        href="mailto:taylor.diamond10@gmail.com"
        className={`inline-flex items-center gap-2 ${linkColor}`}
        aria-label="Email Taylor Diamond"
      >
        <Mail size={18} />
        <span className="text-xs">taylor.diamond10@gmail.com</span>
      </a>
      <a
        href="https://www.instagram.com/its_taylor_diamond/"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 ${linkColor}`}
        aria-label="Instagram @its_taylor_diamond"
      >
        <Instagram size={18} />
        <span className="text-xs">@its_taylor_diamond</span>
      </a>
    </div>
  )
}


