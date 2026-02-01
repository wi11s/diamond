'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronRight, Maximize2 } from 'lucide-react'

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

  // Drag-to-scroll state
  const dragState = useRef<Record<number, {
    isDown: boolean
    startX: number
    scrollLeft: number
    dragged: boolean
  }>>({})

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

  // Handle scroll events to fade titles
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

    photoShoots.forEach((_, index) => {
      const container = document.getElementById(`scroll-container-${index}`)
      if (container) {
        container.addEventListener('scroll', handleScroll)
        setCanScroll(prev => ({
          ...prev,
          [index]: container.scrollWidth > container.clientWidth + 1,
        }))
      }
    })

    return () => {
      photoShoots.forEach((_, index) => {
        const container = document.getElementById(`scroll-container-${index}`)
        if (container) {
          container.removeEventListener('scroll', handleScroll)
        }
      })
    }
  }, [photoShoots])

  // Recalculate title max widths on resize
  useEffect(() => {
    const onResize = () => {
      photoShoots.forEach((_, idx) => measureFirstImage(idx))
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

  // Drag-to-scroll handlers
  const onMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    const container = document.getElementById(`scroll-container-${index}`)
    if (!container) return
    dragState.current[index] = {
      isDown: true,
      startX: e.pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft,
      dragged: false,
    }
    container.style.cursor = 'grabbing'
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent, index: number) => {
    const state = dragState.current[index]
    if (!state?.isDown) return
    const container = document.getElementById(`scroll-container-${index}`)
    if (!container) return
    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = x - state.startX
    if (Math.abs(walk) > 5) {
      state.dragged = true
    }
    container.scrollLeft = state.scrollLeft - walk
  }, [])

  const onMouseUp = useCallback((index: number) => {
    const state = dragState.current[index]
    if (!state) return
    state.isDown = false
    const container = document.getElementById(`scroll-container-${index}`)
    if (container) container.style.cursor = 'grab'
  }, [])

  const onMouseLeave = useCallback((index: number) => {
    const state = dragState.current[index]
    if (!state) return
    state.isDown = false
    const container = document.getElementById(`scroll-container-${index}`)
    if (container) container.style.cursor = 'grab'
  }, [])

  const handlePhotoClick = useCallback((photo: Photo, shootIndex: number) => {
    const state = dragState.current[shootIndex]
    // Only open if user didn't drag
    if (state?.dragged) return
    setSelectedPhoto(photo)
  }, [])

  // Reset expanded loader when a new photo is opened
  useEffect(() => {
    setIsExpandedLoaded(false)
  }, [selectedPhoto?.id])

  return (
    <div className="min-h-screen bg-white text-black">
      {photoShoots.map((shoot, shootIndex) => (
        <section
          key={shoot.name}
          className="h-screen relative overflow-y-hidden"
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
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
              onMouseDown={(e) => onMouseDown(e, shootIndex)}
              onMouseMove={(e) => onMouseMove(e, shootIndex)}
              onMouseUp={() => onMouseUp(shootIndex)}
              onMouseLeave={() => onMouseLeave(shootIndex)}
            >
              {Array.from(new Map(shoot.photos.map((p) => [p.id, p])).values()).map((photo, idx) => (
                <div
                  key={`${photo.id}-${idx}`}
                  className="flex-shrink-0 cursor-pointer h-screen"
                  onClick={() => handlePhotoClick(photo, shootIndex)}
                >
                  <div
                    className="relative w-auto h-screen overflow-hidden"
                    ref={(el) => {
                      if (idx === 0) {
                        firstImageRefs.current[shootIndex] = el
                        if (el) {
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
                      className="h-screen w-auto object-contain"
                      draggable={false}
                      onLoadingComplete={() => {
                        setLoadedIds((prev) => { const next = new Set(prev); next.add(photo.id); return next })
                        if (idx === 0) measureFirstImage(shootIndex)
                      }}
                      sizes="100vh"
                    />
                    {/* Loading skeleton overlay */}
                    <div className={`${loadedIds.has(photo.id) ? 'opacity-0' : 'opacity-100'} absolute inset-0 bg-gradient-to-b from-black/10 to-transparent animate-pulse transition-opacity duration-500`} />
                    {/* Expand icon */}
                    <div className="auto-hide absolute bottom-4 right-4 text-white/70 drop-shadow-lg pointer-events-none">
                      <Maximize2 size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Subtle scroll hint: right-edge gradient + chevron, hidden after scroll */}
            <div
              className={`pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/20 to-transparent transition-opacity duration-300 ${
                canScroll[shootIndex] && !fadedTitles.has(shootIndex) ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <ChevronRight
              className={`hidden md:block pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/70 transition-opacity duration-300 ${
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
