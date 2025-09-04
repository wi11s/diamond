'use client'

import Image from 'next/image'

interface Photo {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

interface LandscapeGalleryProps {
  photos: Photo[]
}

export default function LandscapeGallery({ photos }: LandscapeGalleryProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <section className="min-h-screen relative">
        <div className="max-w-7xl mx-auto px-4 py-24 space-y-8">
          {photos.map((photo) => (
            <div key={photo.id} className="w-full relative">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto object-cover"
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}


