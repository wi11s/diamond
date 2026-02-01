import VibesGallery from '@/components/VibesGallery'
import { getPhotoShoots, getLandscapePhotoShoots } from '@/lib/cloudinary'

export const revalidate = 3600

export default async function VibesPage() {
  const [portraitShoots, landscapeShoots] = await Promise.all([
    getPhotoShoots(),
    getLandscapePhotoShoots(),
  ])

  const allPhotos = [
    ...portraitShoots.flatMap((s: any) => s.photos || []),
    ...landscapeShoots.flatMap((s: any) => s.photos || []),
  ]

  return <VibesGallery photos={allPhotos} />
}
