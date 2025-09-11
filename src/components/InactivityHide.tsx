'use client'

import { useEffect, useRef } from 'react'

export default function InactivityHide() {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const root = document.documentElement

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

    // Initialize
    resetTimer()

    // Only track mouse/keyboard interactions (avoid hiding UI on touch-only devices)
    window.addEventListener('mousemove', resetTimer, { passive: true })
    window.addEventListener('mousedown', resetTimer, { passive: true })
    window.addEventListener('keydown', resetTimer)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      window.removeEventListener('mousemove', resetTimer as any)
      window.removeEventListener('mousedown', resetTimer as any)
      window.removeEventListener('keydown', resetTimer as any)
    }
  }, [])

  return null
}

