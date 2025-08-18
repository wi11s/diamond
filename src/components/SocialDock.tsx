'use client'

import { Instagram, Mail } from 'lucide-react'

export default function SocialDock() {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      <a
        href="mailto:taylor.diamond10@gmail.com"
        className="text-white hover:text-gray-300 transition-colors"
        aria-label="Email Taylor Diamond"
      >
        <Mail size={20} />
      </a>
      <a
        href="https://www.instagram.com/its_taylor_diamond/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-gray-300 transition-colors"
        aria-label="Instagram @its_taylor_diamond"
      >
        <Instagram size={20} />
      </a>
    </div>
  )
}


