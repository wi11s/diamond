'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useGallery } from '@/context/GalleryContext'

export default function InactivityHide() {
  const pathname = usePathname()
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { photosLoaded } = useGallery()

  const isGalleryPage = pathname?.startsWith('/portraits') || pathname?.startsWith('/landscape')

  useEffect(() => {
    if (isGalleryPage && !photosLoaded) return
    document.documentElement.classList.remove('ui-loading')
  }, [isGalleryPage, photosLoaded])

  useEffect(() => {
    if (pathname === '/scroll') return
    const root = document.documentElement

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
      timerRef.current = setTimeout(setIdle, 5000)
    }

    resetTimer()

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
