'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface MindscapeImage {
  id: string
  src: string
  alt: string
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
  rotation: number
  delay: number
}

const mindscapeImages: MindscapeImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    alt: 'Mountain landscape',
    size: 'large',
    position: { x: 10, y: 20 },
    rotation: -8,
    delay: 0
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop',
    alt: 'Portrait',
    size: 'medium',
    position: { x: 75, y: 15 },
    rotation: 12,
    delay: 0.2
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=350&h=250&fit=crop',
    alt: 'Nature',
    size: 'small',
    position: { x: 15, y: 65 },
    rotation: -15,
    delay: 0.4
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
    alt: 'Street scene',
    size: 'small',
    position: { x: 80, y: 70 },
    rotation: 6,
    delay: 0.6
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=350&fit=crop',
    alt: 'Portrait 2',
    size: 'medium',
    position: { x: 50, y: 80 },
    rotation: -10,
    delay: 0.8
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=250&fit=crop',
    alt: 'Ocean',
    size: 'large',
    position: { x: 65, y: 45 },
    rotation: 8,
    delay: 1.0
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=300&fit=crop',
    alt: 'Architecture',
    size: 'small',
    position: { x: 25, y: 45 },
    rotation: -5,
    delay: 1.2
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=350&h=400&fit=crop',
    alt: 'Landscape 2',
    size: 'medium',
    position: { x: 85, y: 25 },
    rotation: 15,
    delay: 1.4
  }
]

const getSizeClasses = (size: string) => {
  switch (size) {
    case 'small':
      return 'w-32 h-24 md:w-40 md:h-32'
    case 'medium':
      return 'w-40 h-48 md:w-52 md:h-64'
    case 'large':
      return 'w-48 h-32 md:w-72 md:h-48'
    default:
      return 'w-40 h-32'
  }
}

export default function ImageMindscape() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {mindscapeImages.map((image) => (
        <motion.div
          key={image.id}
          className={`mindscape-image ${getSizeClasses(image.size)} pointer-events-auto cursor-pointer`}
          style={{
            left: `${image.position.x}%`,
            top: `${image.position.y}%`,
            transform: `rotate(${image.rotation}deg)`,
          }}
          initial={{ 
            opacity: 0, 
            scale: 0.3,
            rotate: image.rotation + 180
          }}
          animate={{ 
            opacity: 0.7, 
            scale: 1,
            rotate: image.rotation
          }}
          transition={{
            duration: 1.2,
            delay: image.delay,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
          whileHover={{
            scale: 1.1,
            rotate: image.rotation + 5,
            opacity: 1,
            zIndex: 50,
            transition: { duration: 0.3 }
          }}
          drag
          dragConstraints={{
            left: -100,
            right: 100,
            top: -100,
            bottom: 100
          }}
          dragElastic={0.2}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 200px, 300px"
            priority={image.id === '1' || image.id === '2'}
          />
        </motion.div>
      ))}

      {/* Floating particles for extra atmosphere */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  )
}