'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { ChevronRight, Maximize2 } from 'lucide-react'
import LoadingScreen from '@/components/LoadingScreen'

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

export default function PhotoGallery({ photoShoots }: { photoShoots: PhotoShoot[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isExpandedLoaded, setIsExpandedLoaded] = useState(false)
  const [galleryReady, setGalleryReady] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [titleMaxWidths, setTitleMaxWidths] = useState<Record<number, number>>({})
  const [canScroll, setCanScroll] = useState<Record<number, boolean>>({})
  const [fadedTitles, setFadedTitles] = useState<Set<number>>(new Set())
  const firstImageRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const containerRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, dragged: false })

  const shoots = useMemo(
    () => photoShoots.map((s) => ({ ...s, photos: Array.from(new Map(s.photos.map((p) => [p.id, p])).values()) })),
    [photoShoots]
  )

  // Fallback: reveal even if image events don't fire
  useEffect(() => {
    const t = setTimeout(() => setGalleryReady(true), 2500)
    return () => clearTimeout(t)
  }, [])

  // Show hint only after the gallery is revealed; sync nav hide timer
  useEffect(() => {
    if (!galleryReady) return
    document.dispatchEvent(new CustomEvent('gallery-ready'))
    setShowHint(true)
    const t = setTimeout(() => setShowHint(false), 3500)
    return () => clearTimeout(t)
  }, [galleryReady])

  // First-image width caps the title; scrollWidth decides the scroll hint
  const measure = useCallback(() => {
    const widths: Record<number, number> = {}
    const scrollable: Record<number, boolean> = {}
    shoots.forEach((_, i) => {
      const w = firstImageRefs.current[i]?.clientWidth
      if (w) widths[i] = w
      const c = containerRefs.current[i]
      if (c) scrollable[i] = c.scrollWidth > c.clientWidth + 1
    })
    setTitleMaxWidths(widths)
    setCanScroll(scrollable)
  }, [shoots])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  // Close expanded photo with Escape
  useEffect(() => {
    if (!selectedPhoto) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedPhoto(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedPhoto])

  const onScroll = (e: React.UIEvent<HTMLDivElement>, index: number) => {
    const beyond = e.currentTarget.scrollLeft > 10
    setFadedTitles((prev) => {
      if (prev.has(index) === beyond) return prev
      const next = new Set(prev)
      if (beyond) next.add(index)
      else next.delete(index)
      return next
    })
  }

  // Drag-to-scroll
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    drag.current = { active: true, startX: e.pageX, scrollLeft: e.currentTarget.scrollLeft, dragged: false }
    e.currentTarget.style.cursor = 'grabbing'
  }

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    e.preventDefault()
    const walk = e.pageX - drag.current.startX
    if (Math.abs(walk) > 5) drag.current.dragged = true
    e.currentTarget.scrollLeft = drag.current.scrollLeft - walk
  }

  const endDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    drag.current.active = false
    e.currentTarget.style.cursor = ''
  }

  const openPhoto = (photo: Photo) => {
    if (drag.current.dragged) return
    setIsExpandedLoaded(false)
    setSelectedPhoto(photo)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Loading overlay — fades out once the first image is ready */}
      <LoadingScreen done={galleryReady} />

      {/* Swipe hint popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          className={`invert-pill rounded-2xl px-6 py-4 flex flex-col items-center gap-2 transition-opacity duration-500 ${showHint ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex items-center gap-2 text-sm font-bold">
            <span>↕</span>
            <span>Swipe up &amp; down to browse shoots</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold">
            <span>↔</span>
            <span>Swipe side to side for photos</span>
          </div>
          <div className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-50 mt-1">
            All photos ©
          </div>
        </div>
      </div>

      {shoots.map((shoot, shootIndex) => (
        <section key={shoot.name} className="relative overflow-y-hidden h-[calc(100dvh-3.5rem)]">
          {/* Static photoshoot title at bottom, fades once the row is scrolled */}
          <div
            className={`absolute bottom-8 left-8 z-10 pointer-events-none transition-opacity duration-300 text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] ${fadedTitles.has(shootIndex) ? 'opacity-0' : 'opacity-100'}`}
            style={{ maxWidth: titleMaxWidths[shootIndex] ? `${titleMaxWidths[shootIndex] - 32}px` : undefined }}
          >
            <h2 className="text-3xl font-bold break-words">{shoot.name}</h2>
          </div>

          <div
            ref={(el) => { containerRefs.current[shootIndex] = el }}
            className="flex overflow-x-auto overflow-y-hidden scrollbar-hide h-full select-none cursor-grab"
            onScroll={(e) => onScroll(e, shootIndex)}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
          >
            {shoot.photos.map((photo, idx) => (
              <div
                key={photo.id}
                ref={idx === 0 ? (el) => { firstImageRefs.current[shootIndex] = el } : undefined}
                className="relative flex-shrink-0 h-full overflow-hidden cursor-pointer"
                onClick={() => openPhoto(photo)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  className="h-full w-auto object-contain"
                  draggable={false}
                  priority={shootIndex === 0 && idx < 3}
                  sizes="100vh"
                  onLoad={() => {
                    if (idx !== 0) return
                    measure()
                    if (shootIndex === 0) setGalleryReady(true)
                  }}
                />
                <Maximize2 size={16} className="absolute bottom-4 right-4 text-white/70 drop-shadow-lg pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Scroll hint: right-edge gradient + chevron while the row can scroll */}
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/20 to-transparent transition-opacity duration-300 ${canScroll[shootIndex] ? 'opacity-100' : 'opacity-0'}`}
          />
          <ChevronRight
            size={20}
            className={`hidden md:block pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] ${canScroll[shootIndex] ? 'opacity-100' : 'opacity-0'}`}
          />
        </section>
      ))}

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-white z-50 p-6"
          onClick={() => setSelectedPhoto(null)}
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
              onLoad={() => setIsExpandedLoaded(true)}
            />
            {!isExpandedLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-[3px] border-transparent border-t-gray-300 rounded-full animate-spin" />
              </div>
            )}
          </div>
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
