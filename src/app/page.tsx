'use client'

import PhotoGallery from '@/components/PhotoGallery'

// Mock data - replace with real Cloudinary data
const mockPhotos = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&h=1600&fit=crop&q=80',
    alt: 'Mountain landscape at sunset',
    width: 2400,
    height: 1600
  },
  {
    id: '2', 
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=2400&h=1600&fit=crop&q=80',
    alt: 'Portrait photography',
    width: 2400,
    height: 1600
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=2400&h=1600&fit=crop&q=80',
    alt: 'Nature photography',
    width: 2400,
    height: 1600
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2400&h=1600&fit=crop&q=80',
    alt: 'Street photography',
    width: 2400,
    height: 1600
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=2400&h=1600&fit=crop&q=80',
    alt: 'Male portrait',
    width: 2400,
    height: 1600
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&h=1600&fit=crop&q=80',
    alt: 'Landscape view',
    width: 2400,
    height: 1600
  }
]

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <PhotoGallery photos={mockPhotos} />
    </div>
  )
}