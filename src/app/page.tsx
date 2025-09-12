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
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Missing Cloudinary environment variables')
      console.error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:', !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
      console.error('CLOUDINARY_API_KEY:', !!process.env.CLOUDINARY_API_KEY)
      console.error('CLOUDINARY_API_SECRET:', !!process.env.CLOUDINARY_API_SECRET)
      photoShoots = fallbackPhotoShoots
    } else {
      photoShoots = await getPhotoShoots()
      
      // If no photo shoots found, use fallback
      if (photoShoots.length === 0) {
        console.error('No photo shoots returned from Cloudinary')
        photoShoots = fallbackPhotoShoots
      }
    }
  } catch (error) {
    console.error('Error loading photo shoots:', error)
    photoShoots = fallbackPhotoShoots
  }

  // Exclude Landscape & Travel from the horizontal gallery; rendered on /landscape instead
  const portraitShootsRaw = photoShoots.filter((shoot) => shoot.name !== 'Landscape & Travel')
  const portraitShoots = portraitShootsRaw
    .map((s: any) => {
      const match = (s.name || '').match(/^\s*(\d+)[\.|\-|\)]\s*(.*)$/)
      const order = match ? parseInt(match[1], 10) : null
      const cleanName = match ? match[2].trim() : (s.name || '').trim()
      return { ...s, name: cleanName, _order: order }
    })
    .sort((a: any, b: any) => {
      const an = a._order, bn = b._order
      if (an != null && bn != null) return an - bn
      if (an != null && bn == null) return -1
      if (an == null && bn != null) return 1
      return a.name.localeCompare(b.name)
    })
    .map(({ _order, ...rest }: any) => rest)

  return (
    <div className="min-h-screen relative">
      <PhotoGallery photoShoots={portraitShoots} />
    </div>
  )
}
