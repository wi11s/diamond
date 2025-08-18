'use client'

import { useState, useRef } from 'react'
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

  return (
    <div className="min-h-screen bg-black text-white">
      {photoShoots.map((shoot, shootIndex) => (
        <section 
          key={shoot.name} 
          className="h-screen relative"
        >          
          <div className="relative h-screen">
            <div
              id={`scroll-container-${shootIndex}`}
              className="flex overflow-x-auto scrollbar-hide scroll-smooth h-screen"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {shoot.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="flex-shrink-0 cursor-pointer group/photo h-screen"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <div className="relative w-auto h-screen overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      className="h-screen w-auto object-cover transition-transform duration-300 group-hover/photo:scale-105"
                      sizes="100vh"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/20 transition-all duration-300" />
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