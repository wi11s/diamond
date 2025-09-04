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
        <div className="w-full py-12">
          {photos.map((photo, idx) => (
            <div key={photo.id} className={`w-full relative border-t border-white ${idx === 0 ? 'first:border-t-0' : ''}`}>
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
    </div>
  )
}


