'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface Photo {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

interface PhotoGalleryProps {
  photos: Photo[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const currentPhoto = photos[currentPhotoIndex]

  if (!currentPhoto) return null

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-screen">
        <Image
          src={currentPhoto.src}
          alt={currentPhoto.alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        
        <button
          onClick={prevPhoto}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-gray-300"
        >
          <ArrowLeft size={24} />
        </button>
        
        <button
          onClick={nextPhoto}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:text-gray-300"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  )
}