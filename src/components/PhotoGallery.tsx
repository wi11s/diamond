'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Photo {
  id: string
  src: string
  alt: string
  width: number
  height: number
  public_id?: string
}

interface PhotoShoot {
  name: string
  photos: Photo[]
}

interface PhotoGalleryProps {
  photoShoots: PhotoShoot[]
}

export default function PhotoGallery({ photoShoots }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set())
  const [fadedTitles, setFadedTitles] = useState<Set<number>>(new Set())
  const [isExpandedLoaded, setIsExpandedLoaded] = useState(false)
  const firstImageRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const [titleMaxWidths, setTitleMaxWidths] = useState<Record<number, number>>({})
  const [canScroll, setCanScroll] = useState<Record<number, boolean>>({})
  const holdScroll = useRef<Record<number, { raf: number | null; dir: -1 | 1; last: number }>>({})

  const measureFirstImage = (index: number) => {
    const el = firstImageRefs.current[index]
    if (el) {
      const width = el.clientWidth
      if (width && width > 0) {
        setTitleMaxWidths(prev => {
          if (prev[index] === width) return prev
          return { ...prev, [index]: width }
        })
      }
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = (containerId: string) => {
    const container = document.getElementById(containerId)
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = (containerId: string) => {
    const container = document.getElementById(containerId)
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  // Handle scroll events to fade titles (only update when state changes)
  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement
      const shootIndex = parseInt(target.id.replace('scroll-container-', ''))
      if (isNaN(shootIndex)) return
      const beyond = target.scrollLeft > 10
      setFadedTitles(prev => {
        const has = prev.has(shootIndex)
        if (beyond && !has) {
          const next = new Set(prev)
          next.add(shootIndex)
          return next
        }
        if (!beyond && has) {
          const next = new Set(prev)
          next.delete(shootIndex)
          return next
        }
        return prev
      })
    }

    // Add scroll listeners to all scroll containers
    photoShoots.forEach((_, index) => {
      const container = document.getElementById(`scroll-container-${index}`)
      if (container) {
        container.addEventListener('scroll', handleScroll)
        // Determine if this container is horizontally scrollable
        setCanScroll(prev => ({
          ...prev,
          [index]: container.scrollWidth > container.clientWidth + 1,
        }))

        // No scroll listeners here; hover zones below handle auto-scroll
        ;(container as any)._autoScrollCleanup = () => {}
      }
    })

    return () => {
      // Cleanup listeners
      photoShoots.forEach((_, index) => {
        const container = document.getElementById(`scroll-container-${index}`)
        if (container) {
          container.removeEventListener('scroll', handleScroll)
          if ((container as any)._autoScrollCleanup) (container as any)._autoScrollCleanup()
        }
      })
    }
  }, [photoShoots])

  // Recalculate title max widths on resize
  useEffect(() => {
    const onResize = () => {
      photoShoots.forEach((_, idx) => measureFirstImage(idx))
      // Re-check scrollability on resize
      photoShoots.forEach((_, idx) => {
        const container = document.getElementById(`scroll-container-${idx}`)
        if (container) {
          setCanScroll(prev => ({
            ...prev,
            [idx]: container.scrollWidth > container.clientWidth + 1,
          }))
        }
      })
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [photoShoots])

  // Clear any running hold-scroll animations on unmount
  useEffect(() => {
    return () => {
      Object.values(holdScroll.current).forEach((st) => {
        if (st?.raf) cancelAnimationFrame(st.raf)
      })
      holdScroll.current = {}
    }
  }, [])

  const startHoldScroll = (index: number, dir: -1 | 1) => {
    const el = document.getElementById(`scroll-container-${index}`) as HTMLElement | null
    if (!el) return
    if (!(el.scrollWidth > el.clientWidth + 1)) return
    if (!holdScroll.current[index]) holdScroll.current[index] = { raf: null, dir, last: performance.now() }
    const st = holdScroll.current[index]
    st.dir = dir
    if (st.raf) return
    const MAX = 350 // px/s (slow, smooth)
    const step = (ts: number) => {
      const state = holdScroll.current[index]
      if (!state) return
      const dt = state.last ? (ts - state.last) / 1000 : 0
      state.last = ts
      const dist = MAX * dt * state.dir
      const maxScroll = el.scrollWidth - el.clientWidth
      el.scrollLeft = Math.max(0, Math.min(maxScroll, el.scrollLeft + dist))
      state.raf = requestAnimationFrame(step)
    }
    st.last = performance.now()
    st.raf = requestAnimationFrame(step)
  }

  const stopHoldScroll = (index: number) => {
    const st = holdScroll.current[index]
    if (!st) return
    if (st.raf) cancelAnimationFrame(st.raf)
    holdScroll.current[index] = { raf: null, dir: st.dir, last: performance.now() }
  }

  // console.debug('photoShoots', photoShoots)

  // Reset expanded loader when a new photo is opened
  useEffect(() => {
    setIsExpandedLoaded(false)
  }, [selectedPhoto?.id])

  return (
    <div className="min-h-screen bg-white text-black">
      {photoShoots.map((shoot, shootIndex) => (
        <section 
          key={shoot.name} 
          className="h-screen relative overflow-y-hidden border-t border-white"
        >
          {/* Static Photoshoot Title at bottom */}
          <div 
            className={`absolute bottom-8 left-8 z-10 transition-opacity duration-300 pointer-events-none ${
              fadedTitles.has(shootIndex) ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ maxWidth: titleMaxWidths[shootIndex] ? `${titleMaxWidths[shootIndex] - 32}px` : undefined }}
          >
            <h2 className="text-3xl font-bold text-white drop-shadow-lg whitespace-normal break-words">
              {shoot.name}
            </h2>
          </div>
          
          <div className="relative h-screen overflow-hidden">
            <div
              id={`scroll-container-${shootIndex}`}
              className="flex overflow-x-auto overflow-y-hidden scrollbar-hide h-screen select-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {Array.from(new Map(shoot.photos.map((p) => [p.id, p])).values()).map((photo, idx) => (
                <div
                  key={`${photo.id}-${idx}`}
                  className="flex-shrink-0 cursor-pointer group/photo h-screen border-l border-y border-white first:border-l-0"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div
                    className="relative w-auto h-screen overflow-hidden"
                    ref={(el) => {
                      if (idx === 0) {
                        firstImageRefs.current[shootIndex] = el
                        // try to measure asap if element already laid out
                        if (el) {
                          // Defer to next frame to ensure layout
                          requestAnimationFrame(() => measureFirstImage(shootIndex))
                        }
                      }
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      className="h-screen w-auto object-contain transition-transform duration-300"
                      draggable={false}
                      onLoadingComplete={() => {
                        setLoadedIds((prev) => { const next = new Set(prev); next.add(photo.id); return next })
                        if (idx === 0) measureFirstImage(shootIndex)
                      }}
                      sizes="100vh"
                    />
                    {/* Loading skeleton overlay */}
                    <div className={`${loadedIds.has(photo.id) ? 'opacity-0' : 'opacity-100'} absolute inset-0 bg-gradient-to-b from-black/10 to-transparent animate-pulse transition-opacity duration-500`} />
                    {/* Dark-to-light hover overlay (slightly lighter by default) */}
                    <div className="absolute inset-0 bg-black/25 group-hover/photo:bg-black/0 transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
            {/* Edge hover zones for auto-scroll; do not block vertical page scroll */}
            <div
              className="absolute inset-y-0 left-0 w-24 z-30 pointer-events-auto"
              onMouseEnter={() => startHoldScroll(shootIndex, -1)}
              onMouseLeave={() => stopHoldScroll(shootIndex)}
            />
            <div
              className="absolute inset-y-0 right-0 w-24 z-30 pointer-events-auto"
              onMouseEnter={() => startHoldScroll(shootIndex, 1)}
              onMouseLeave={() => stopHoldScroll(shootIndex)}
            />
            {/* Subtle scroll hint: right-edge gradient + chevron, hidden after scroll */}
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/20 to-transparent transition-opacity duration-300 ${
                canScroll[shootIndex] && !fadedTitles.has(shootIndex) ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <ChevronRight
              className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/70 transition-opacity duration-300 ${
                canScroll[shootIndex] && !fadedTitles.has(shootIndex) ? 'opacity-100' : 'opacity-0'
              } animate-pulse`}
              size={20}
            />
          </div>
        </section>
      ))}

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-white z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={selectedPhoto.public_id && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                  ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${selectedPhoto.public_id}`
                  : selectedPhoto.src}
                alt={selectedPhoto.alt}
                fill
                className="object-contain"
                sizes="100vw"
                unoptimized
                onLoadingComplete={() => setIsExpandedLoaded(true)}
              />
              {/* Loading overlay: match page spinner */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  isExpandedLoaded ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="w-6 h-6 border-[3px] border-transparent border-t-gray-300 rounded-full animate-spin" />
              </div>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
