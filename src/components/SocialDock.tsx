'use client'

import { Instagram, Mail } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function SocialDock() {
  const pathname = usePathname()
  const needsPillBg = pathname === '/dates'

  return (
    <div className={`auto-hide fixed bottom-6 right-6 z-50 flex flex-col gap-3 ${needsPillBg ? 'bg-white/90 backdrop-blur-sm p-2 rounded-full' : ''}`}>
      <a
        href="mailto:taylor.diamond10@gmail.com"
        className={`transition-colors ${needsPillBg ? 'text-black hover:text-black/70' : 'text-white hover:text-gray-300'}`}
        aria-label="Email Taylor Diamond"
      >
        <Mail size={20} />
      </a>
      <a
        href="https://www.instagram.com/its_taylor_diamond/"
        target="_blank"
        rel="noopener noreferrer"
        className={`transition-colors ${needsPillBg ? 'text-black hover:text-black/70' : 'text-white hover:text-gray-300'}`}
        aria-label="Instagram @its_taylor_diamond"
      >
        <Instagram size={20} />
      </a>
    </div>
  )
}
