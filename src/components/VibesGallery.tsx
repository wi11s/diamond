'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  src: string
  alt: string
  width: number
  height: number
  public_id?: string
}

interface VibesGalleryProps {
  photos: Photo[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function VibesGallery({ photos }: VibesGalleryProps) {
  const [shuffled, setShuffled] = useState<Photo[]>([])
  const scrolling = useRef(true)
  const rafId = useRef<number>(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Shuffle on mount
  useEffect(() => {
    setShuffled(shuffle(photos))
  }, [photos])

  const pauseScroll = useCallback(() => {
    scrolling.current = false
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => {
      scrolling.current = true
    }, 3000)
  }, [])

  useEffect(() => {
    const step = () => {
      if (scrolling.current) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        if (window.scrollY >= maxScroll - 1) {
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        } else {
          window.scrollBy(0, 0.5)
        }
      }
      rafId.current = requestAnimationFrame(step)
    }

    rafId.current = requestAnimationFrame(step)

    const onInteract = () => pauseScroll()

    window.addEventListener('wheel', onInteract, { passive: true })
    window.addEventListener('touchstart', onInteract, { passive: true })
    window.addEventListener('mousedown', onInteract)
    window.addEventListener('keydown', onInteract)

    return () => {
      cancelAnimationFrame(rafId.current)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      window.removeEventListener('wheel', onInteract)
      window.removeEventListener('touchstart', onInteract)
      window.removeEventListener('mousedown', onInteract)
      window.removeEventListener('keydown', onInteract)
    }
  }, [pauseScroll])

  if (shuffled.length === 0) return null

  return (
    <div className="w-full">
      {shuffled.map((photo, i) => (
        <div key={`${photo.id}-${i}`}>
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="w-full h-auto block"
            sizes="100vw"
          />
        </div>
      ))}
    </div>
  )
}
