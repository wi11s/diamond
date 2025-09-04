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

  console.log(photoShoots)

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
          >
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              {shoot.name}
            </h2>
          </div>
          
          <div className="relative h-screen overflow-hidden">
            <div
              id={`scroll-container-${shootIndex}`}
              className="flex overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth h-screen"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {shoot.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="flex-shrink-0 cursor-pointer group/photo h-screen border-l border-y border-white first:border-l-0"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="relative w-auto h-screen overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      className="h-screen w-auto object-contain transition-transform duration-300"
                      onLoadingComplete={() => setLoadedIds((prev) => { const next = new Set(prev); next.add(photo.id); return next })}
                      sizes="100vh"
                    />
                    {/* Loading skeleton overlay */}
                    <div className={`${loadedIds.has(photo.id) ? 'opacity-0' : 'opacity-100'} absolute inset-0 bg-gradient-to-b from-black/10 to-transparent animate-pulse transition-opacity duration-500`} />
                    {/* Dark-to-light hover overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover/photo:bg-black/0 transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              width={selectedPhoto.width}
              height={selectedPhoto.height}
              className="object-contain max-w-full max-h-full"
              sizes="100vw"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}