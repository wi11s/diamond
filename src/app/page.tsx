import PhotoGallery from '@/components/PhotoGallery'
import { getPhotoShoots } from '@/lib/cloudinary'

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

// Fallback mock data in case Cloudinary fails
const fallbackPhotoShoots: PhotoShoot[] = [
  {
    name: 'Sample Portfolio',
    photos: [
      {
        id: 'sample1',
        src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=2400&h=1600&fit=crop&q=80',
        alt: 'Sample Photo 1',
        width: 2400,
        height: 1600
      },
      {
        id: 'sample2',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&h=1600&fit=crop&q=80',
        alt: 'Sample Photo 2',
        width: 2400,
        height: 1600
      }
    ]
  }
]

export default async function Home() {
  let photoShoots: PhotoShoot[] = []
  
  try {
    photoShoots = await getPhotoShoots()
    
    // If no photo shoots found, use fallback
    if (photoShoots.length === 0) {
      photoShoots = fallbackPhotoShoots
    }
  } catch (error) {
    console.error('Error loading photo shoots:', error)
    photoShoots = fallbackPhotoShoots
  }

  return (
    <div className="min-h-screen relative">
      <PhotoGallery photoShoots={photoShoots} />
    </div>
  )
}