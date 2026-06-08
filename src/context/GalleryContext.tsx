'use client'

import { createContext, useContext, useState } from 'react'

const GalleryContext = createContext<{
  photosLoaded: boolean
  setPhotosLoaded: (v: boolean) => void
}>({ photosLoaded: false, setPhotosLoaded: () => {} })

export function GalleryProvider({ children }: { children: React.ReactNode }) {
  const [photosLoaded, setPhotosLoaded] = useState(false)
  return (
    <GalleryContext.Provider value={{ photosLoaded, setPhotosLoaded }}>
      {children}
    </GalleryContext.Provider>
  )
}

export const useGallery = () => useContext(GalleryContext)
