import PhotoGallery from '@/components/PhotoGallery'
import { getPhotoShoots } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export default async function PortraitsPage() {
  const allShoots: any[] = await getPhotoShoots()
  const portraitShootsRaw = allShoots.filter((s: any) => s.name !== 'Landscape & Travel')

  // Sort by numeric prefix in name (e.g., "10.", "9)", "8 -"), descending
  // and strip the numeric prefix from the display name.
  const processed = portraitShootsRaw
    .map((s: any) => {
      const match = (s.name || '').match(/^\s*(\d+)[\.|\-|\)]\s*(.*)$/)
      const order = match ? parseInt(match[1], 10) : null
      const cleanName = match ? match[2].trim() : (s.name || '').trim()
      return { ...s, name: cleanName, _order: order }
    })
    .sort((a: any, b: any) => {
      const an = a._order, bn = b._order
      if (an != null && bn != null) return an - bn // 1, 2, 3 ...
      if (an != null && bn == null) return -1
      if (an == null && bn != null) return 1
      return a.name.localeCompare(b.name)
    })
    .map(({ _order, ...rest }: any) => rest)

  return (
    <div className="min-h-screen relative">
      <PhotoGallery photoShoots={processed} />
    </div>
  )
}
