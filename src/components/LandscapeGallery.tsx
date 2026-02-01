'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Photo {
  id: string
  src: string
  alt: string
  width: number
  height: number
  public_id?: string
}

interface LandscapeGalleryProps {
  photos: Photo[]
}

export default function LandscapeGallery({ photos }: LandscapeGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isExpandedLoaded, setIsExpandedLoaded] = useState(false)

  useEffect(() => {
    setIsExpandedLoaded(false)
  }, [selectedPhoto?.id])

  return (
    <div className="min-h-screen bg-white text-black">
      <section className="min-h-screen relative">
        <div className="w-full">
          {Array.from(new Map(photos.map((p) => [p.id, p])).values()).map((photo, idx) => (
            <div
              key={`${photo.id}-${idx}`}
              className="w-full relative cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto object-contain"
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </section>

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
