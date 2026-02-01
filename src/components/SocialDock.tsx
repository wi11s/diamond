'use client'

import { Instagram, Mail } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function SocialDock() {
  const pathname = usePathname()
  const isLightPage = pathname === '/' || pathname === '/dates' || pathname === '/bio' || pathname === '/links'
  const needsPillBg = pathname === '/dates'

  const iconClass = isLightPage
    ? 'transition-colors text-black hover:text-black/70'
    : 'transition-colors text-white hover:text-white/70'

  return (
    <div className={`auto-hide fixed bottom-6 right-6 z-50 flex flex-col gap-3 ${needsPillBg ? 'bg-white/90 backdrop-blur-sm p-2 rounded-full' : ''}`}>
      <a
        href="mailto:taylor.diamond10@gmail.com"
        className={iconClass}
        aria-label="Email Taylor Diamond"
      >
        <Mail size={20} />
      </a>
      <a
        href="https://www.instagram.com/its_taylor_diamond/"
        target="_blank"
        rel="noopener noreferrer"
        className={iconClass}
        aria-label="Instagram @its_taylor_diamond"
      >
        <Instagram size={20} />
      </a>
    </div>
  )
}
