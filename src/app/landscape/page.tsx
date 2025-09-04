import LandscapeGallery from '@/components/LandscapeGallery'
import { getLandscapePhotos } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export default async function LandscapePage() {
  const photos = await getLandscapePhotos()

  return (
    <div className="min-h-screen relative">
      <LandscapeGallery photos={photos} />
    </div>
  )
}


