'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function InactivityHide() {
  const pathname = usePathname()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (pathname === '/scroll') return
    const root = document.documentElement

    // On mobile/touch devices, keep UI always visible
    const isMobile =
      (typeof window !== 'undefined' && (
        window.matchMedia('(max-width: 767px)').matches ||
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window
      )) || false

    if (isMobile) {
      root.classList.remove('ui-idle')
      return
    }

    const setIdle = () => {
      root.classList.add('ui-idle')
    }
    const setActive = () => {
      root.classList.remove('ui-idle')
    }

    const resetTimer = () => {
      setActive()
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(setIdle, 2000)
    }

    // Initialize (desktop only)
    resetTimer()

    // Desktop interactions for idle tracking
    window.addEventListener('mousemove', resetTimer, { passive: true })
    window.addEventListener('mousedown', resetTimer, { passive: true })
    window.addEventListener('keydown', resetTimer)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      window.removeEventListener('mousemove', resetTimer as any)
      window.removeEventListener('mousedown', resetTimer as any)
      window.removeEventListener('keydown', resetTimer as any)
    }
  }, [pathname])

  return null
}
