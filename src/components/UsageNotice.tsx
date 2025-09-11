'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function UsageNotice() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  // Only show on portrait and landscape pages
  const allowed = pathname?.startsWith('/portraits') || pathname?.startsWith('/landscape')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!allowed) return null

  const visible = !scrolled

  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-30 flex justify-center pointer-events-none transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden
    >
      <div className="px-3 py-1 rounded-full bg-white/80 border border-gray-200 text-[11px] leading-none text-gray-600 shadow-sm">
        All photos © Taylor Diamond
      </div>
    </div>
  )
}
