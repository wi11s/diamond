'use client'

import PhotoGallery from '@/components/PhotoGallery'

// Mock data - replace with real Cloudinary data
const mockPhotos = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&h=1600&fit=crop&q=80',
    alt: 'Mountain landscape at sunset',
    width: 2400,
    height: 1600,
    category: 'LANDSCAPE'
  },
  {
    id: '2', 
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=2400&h=1600&fit=crop&q=80',
    alt: 'Portrait photography',
    width: 2400,
    height: 1600,
    category: 'PORTRAIT'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=2400&h=1600&fit=crop&q=80',
    alt: 'Nature photography',
    width: 2400,
    height: 1600,
    category: 'NATURE'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2400&h=1600&fit=crop&q=80',
    alt: 'Street photography',
    width: 2400,
    height: 1600,
    category: 'STREET'
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=2400&h=1600&fit=crop&q=80',
    alt: 'Male portrait',
    width: 2400,
    height: 1600,
    category: 'PORTRAIT'
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&h=1600&fit=crop&q=80',
    alt: 'Landscape view',
    width: 2400,
    height: 1600,
    category: 'LANDSCAPE'
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=2400&h=1600&fit=crop&q=80',
    alt: 'Ocean waves',
    width: 2400,
    height: 1600,
    category: 'NATURE'
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=2400&h=1600&fit=crop&q=80',
    alt: 'Urban architecture',
    width: 2400,
    height: 1600,
    category: 'STREET'
  },
  {
    id: '9',
    src: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1600&h=2400&fit=crop&q=80',
    alt: 'Iceland landscape',
    width: 1600,
    height: 2400,
    category: 'LANDSCAPE'
  },
  {
    id: '10',
    src: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=2400&h=1600&fit=crop&q=80',
    alt: 'Street art',
    width: 2400,
    height: 1600,
    category: 'STREET'
  }
]

const categories = ['LANDSCAPE', 'PORTRAIT', 'NATURE', 'STREET']

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <PhotoGallery photos={mockPhotos} categories={categories} />
    </div>
  )
}