'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react'

interface Photo {
  id: string
  src: string
  alt: string
  width: number
  height: number
  category?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
  categories?: string[]
}

export default function PhotoGallery({ photos, categories = [] }: PhotoGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [currentSection, setCurrentSection] = useState(0) // 0 = all, 1+ = category index
  const [showInfo, setShowInfo] = useState(false)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Disable page scrolling when gallery is active
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  // Create sections: all photos + each category
  const sections = [
    { name: 'ALL', photos },
    ...categories.map(category => ({
      name: category,
      photos: photos.filter(photo => photo.category === category)
    }))
  ]

  const currentSectionData = sections[currentSection]
  const currentPhotos = currentSectionData?.photos || []

  const nextPhoto = () => {
    if (currentPhotoIndex < currentPhotos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1)
    } else {
      // Move to next section
      if (currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1)
        setCurrentPhotoIndex(0)
      } else {
        // Wrap to first section
        setCurrentSection(0)
        setCurrentPhotoIndex(0)
      }
    }
    setPanPosition({ x: 0, y: 0 })
  }

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1)
    } else {
      // Move to previous section
      if (currentSection > 0) {
        const prevSectionIndex = currentSection - 1
        setCurrentSection(prevSectionIndex)
        setCurrentPhotoIndex(sections[prevSectionIndex].photos.length - 1)
      } else {
        // Wrap to last section
        const lastSectionIndex = sections.length - 1
        setCurrentSection(lastSectionIndex)
        setCurrentPhotoIndex(sections[lastSectionIndex].photos.length - 1)
      }
    }
    setPanPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const startX = e.clientX - panPosition.x
    const startY = e.clientY - panPosition.y

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging) return
      
      const newX = moveEvent.clientX - startX
      const newY = moveEvent.clientY - startY
      
      // Constrain panning within reasonable bounds - horizontal only
      const maxPan = 400
      const constrainedX = Math.max(-maxPan, Math.min(maxPan, newX))
      
      setPanPosition({ x: constrainedX, y: 0 })

      // Check for edge transitions
      if (Math.abs(constrainedX) >= maxPan * 0.8) {
        if (constrainedX > 0) {
          prevPhoto()
        } else {
          nextPhoto()
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      // Snap back to center unless transitioning
      if (Math.abs(panPosition.x) < 320) {
        setPanPosition({ x: 0, y: 0 })
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    
    // Horizontal scroll changes photos
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (e.deltaX > 0) {
        nextPhoto()
      } else {
        prevPhoto()
      }
    }
    // Remove vertical scrolling/panning completely
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      return () => container.removeEventListener('wheel', handleWheel)
    }
  }, [panPosition])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'd':
          nextPhoto()
          break
        case 'ArrowLeft':
        case 'a':
          prevPhoto()
          break
        case 'ArrowUp':
        case 'w':
          // Remove vertical panning
          break
        case 'ArrowDown':
        case 's':
          // Remove vertical panning
          break
        case 'i':
          setShowInfo(!showInfo)
          break
        case 'Escape':
          setShowInfo(false)
          setPanPosition({ x: 0, y: 0 })
          break
        case ' ':
          e.preventDefault()
          setPanPosition({ x: 0, y: 0 })
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showInfo, currentPhotos.length])

  const currentPhoto = currentPhotos[currentPhotoIndex]
  
  // Get next photo data (could be from next section)
  const getNextPhotoData = () => {
    if (currentPhotoIndex < currentPhotos.length - 1) {
      return currentPhotos[currentPhotoIndex + 1]
    } else if (currentSection < sections.length - 1) {
      return sections[currentSection + 1].photos[0]
    } else {
      return sections[0].photos[0]
    }
  }

  // Get previous photo data (could be from previous section)
  const getPrevPhotoData = () => {
    if (currentPhotoIndex > 0) {
      return currentPhotos[currentPhotoIndex - 1]
    } else if (currentSection > 0) {
      const prevSection = sections[currentSection - 1]
      return prevSection.photos[prevSection.photos.length - 1]
    } else {
      const lastSection = sections[sections.length - 1]
      return lastSection.photos[lastSection.photos.length - 1]
    }
  }

  const nextPhotoData = getNextPhotoData()
  const prevPhotoData = getPrevPhotoData()

  if (!currentPhoto) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden cursor-grab"
      onMouseDown={handleMouseDown}
      style={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        height: '100vh',
        width: '100vw'
      }}
    >
      {/* Main Photo with Panning */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        animate={{ 
          x: panPosition.x, 
          y: 0,
          scale: 1 + Math.abs(panPosition.x) * 0.0005
        }}
        transition={{ type: "tween", duration: isDragging ? 0 : 0.3 }}
      >
        <Image
          key={currentPhoto.id}
          src={currentPhoto.src}
          alt={currentPhoto.alt}
          fill
          className="object-cover"
          sizes="100vw"
          quality={85}
          priority
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Edge Previews */}
      {/* Left edge - Previous photo */}
      <motion.div 
        className="absolute top-0 left-0 w-32 h-full overflow-hidden"
        animate={{ 
          x: panPosition.x > 200 ? 0 : -128,
          opacity: panPosition.x > 200 ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={prevPhotoData.src}
          alt={prevPhotoData.alt}
          fill
          className="object-cover object-right"
          sizes="128px"
          quality={75}
        />
      </motion.div>

      {/* Right edge - Next photo */}
      <motion.div 
        className="absolute top-0 right-0 w-32 h-full overflow-hidden"
        animate={{ 
          x: panPosition.x < -200 ? 0 : 128,
          opacity: panPosition.x < -200 ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={nextPhotoData.src}
          alt={nextPhotoData.alt}
          fill
          className="object-cover object-left"
          sizes="128px"
          quality={75}
        />
      </motion.div>

      {/* Section Navigation - Minimal */}
      <div className="fixed top-8 left-8 z-20 flex flex-col gap-2">
        {sections.map((section, index) => (
          <button
            key={section.name}
            onClick={() => {
              setCurrentSection(index)
              setCurrentPhotoIndex(0)
              setPanPosition({ x: 0, y: 0 })
            }}
            className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all ${
              currentSection === index
                ? 'text-white bg-white/20'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="fixed top-8 right-8 z-20 text-white font-mono text-sm">
        <div className="text-right">
          <div className="text-white/80 text-xs mb-1">{currentSectionData.name}</div>
          <div>{String(currentPhotoIndex + 1).padStart(2, '0')} / {String(currentPhotos.length).padStart(2, '0')}</div>
        </div>
      </div>

      {/* Photo Information */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-8 z-20 max-w-md"
          >
            <div className="bg-black/80 backdrop-blur-sm p-6 text-white">
              <h2 className="text-2xl font-light mb-2 leading-tight">
                {currentPhoto.alt}
              </h2>
              {currentPhoto.category && (
                <p className="text-sm font-mono uppercase tracking-wider text-white/70 mb-4">
                  {currentPhoto.category}
                </p>
              )}
              <div className="text-xs font-mono text-white/50 space-y-1">
                <p>Navigate through sections seamlessly</p>
                <p>Drag or use arrow keys • Scroll to pan</p>
                <p>Press I to toggle info • Space to center</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruction hint */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 4, duration: 1 }}
        className="fixed bottom-8 right-8 z-20 text-white/50 font-mono text-xs text-right space-y-1"
      >
        <p>Navigate sections seamlessly</p>
        <p>Drag to explore • I for info</p>
      </motion.div>

      {/* Section Transition Indicator */}
      {(currentPhotoIndex === currentPhotos.length - 1 || currentPhotoIndex === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white/60 font-mono text-xs text-center"
        >
          {currentPhotoIndex === currentPhotos.length - 1 && currentSection < sections.length - 1 && (
            <p>→ Continue to {sections[currentSection + 1].name}</p>
          )}
          {currentPhotoIndex === 0 && currentSection > 0 && (
            <p>← Back to {sections[currentSection - 1].name}</p>
          )}
        </motion.div>
      )}
    </div>
  )
}