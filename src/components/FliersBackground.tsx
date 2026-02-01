'use client'

interface PhotoLike {
  id: string
  src: string
  alt?: string
  width?: number
  height?: number
}

export default function FliersBackground({ photos, absolute = true }: { photos: PhotoLike[]; absolute?: boolean }) {
  if (!photos || photos.length === 0) return null

  const pool = Array.from({ length: Math.max(photos.length, 96) }, (_, i) => photos[i % photos.length])

  const wrapperClass = absolute
    ? 'pointer-events-none absolute inset-0 z-0 overflow-hidden'
    : 'w-full overflow-hidden'

  return (
    <div className={wrapperClass} aria-hidden={absolute ? true : undefined}>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-0">
        {pool.map((p, i) => (
          <div key={`${p.id}-${i}`} className="aspect-square overflow-hidden bg-gray-100">
            <img
              src={p.src}
              alt={p.alt || 'DJ flier'}
              className="block w-full h-full object-cover"
              loading={i < 8 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
