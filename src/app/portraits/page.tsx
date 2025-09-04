import PhotoGallery from '@/components/PhotoGallery'
import { getPhotoShoots } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export default async function PortraitsPage() {
  const allShoots: any[] = await getPhotoShoots()
  const portraitShoots = allShoots.filter((s: any) => s.name !== 'Landscape & Travel')

  return (
    <div className="min-h-screen relative">
      <PhotoGallery photoShoots={portraitShoots} />
    </div>
  )
}


