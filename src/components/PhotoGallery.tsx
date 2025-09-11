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

  const measureFirstImage = (index: number) => {
    const el = firstImageRefs.current[index]
    if (el) {
      const width = el.clientWidth
      if (width && width > 0) {
        setTitleMaxWidths(prev => ({ ...prev, [index]: width }))
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

  // Handle scroll events to fade titles
  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement
      const shootIndex = parseInt(target.id.replace('scroll-container-', ''))
      
      if (!isNaN(shootIndex)) {
        if (target.scrollLeft > 10) {
          setFadedTitles(prev => new Set(prev).add(shootIndex))
        } else {
          setFadedTitles(prev => {
            const newSet = new Set(prev)
            newSet.delete(shootIndex)
            return newSet
          })
        }
      }
    }

    // Add scroll listeners to all scroll containers
    photoShoots.forEach((_, index) => {
      const container = document.getElementById(`scroll-container-${index}`)
      if (container) {
        container.addEventListener('scroll', handleScroll)
      }
    })

    return () => {
      // Cleanup listeners
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
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [photoShoots])

  console.log(photoShoots)

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
          {/* Static Photoshoot Title */}
          <div 
            className={`absolute bottom-8 left-8 z-10 transition-opacity duration-300 ${
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
              className="flex overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth h-screen"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {shoot.photos.map((photo, idx) => (
                <div
                  key={photo.id}
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
              className="absolute top-4 right-4 text-black hover:text-gray-600 text-2xl"
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
