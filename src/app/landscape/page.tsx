import PhotoGallery from '@/components/PhotoGallery'
import { getLandscapePhotoShoots } from '@/lib/cloudinary'

export const revalidate = 3600

export default async function LandscapePage() {
  const allShoots: any[] = await getLandscapePhotoShoots()

  // Sort by numeric prefix in name (same logic as portraits page)
  const processed = allShoots
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
    .map((shoot: any) => ({
      ...shoot,
      photos: [...(shoot.photos || [])].sort((a: any, b: any) => {
        const an = (a.alt || a.display_name || a.id || '').toString().toLowerCase()
        const bn = (b.alt || b.display_name || b.id || '').toString().toLowerCase()
        return an.localeCompare(bn, undefined, { sensitivity: 'base' })
      })
    }))

  return (
    <div className="min-h-screen relative">
      <PhotoGallery photoShoots={processed} />
    </div>
  )
}
