import LandscapeGallery from '@/components/LandscapeGallery'
import GrainBackground from '@/components/GrainBackground'
import { getLandscapePhotos } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export default async function LandscapePage() {
  const photos = await getLandscapePhotos()

  return (
    <div className="min-h-screen relative">
      <GrainBackground />
      <LandscapeGallery photos={photos} />
    </div>
  )
}


