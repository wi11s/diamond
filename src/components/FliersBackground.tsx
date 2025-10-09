'use client'

interface PhotoLike {
  id: string
  src: string
  alt?: string
  width?: number
  height?: number
}

// A zero-gap, simple grid background for fliers.
// Uniform tiles with consistent aspect ratio for a clean layout.
export default function FliersBackground({ photos, absolute = true }: { photos: PhotoLike[]; absolute?: boolean }) {
  if (!photos || photos.length === 0) return null

  // Ensure we have enough tiles to cover large screens by repeating.
  const pool = Array.from({ length: Math.max(photos.length, 96) }, (_, i) => photos[i % photos.length])

  const wrapperClass = absolute
    ? 'pointer-events-none absolute inset-0 z-0 overflow-hidden'
    : 'w-full overflow-hidden'

  return (
    <div className={wrapperClass} aria-hidden={absolute ? true : undefined}>
      <div className="w-full [column-gap:0] columns-3 sm:columns-4 md:columns-6 lg:columns-8">
        {pool.map((p, i) => (
          <div key={`${p.id}-${i}`} className="break-inside-avoid">
            <img
              src={p.src}
              alt={p.alt || 'DJ flier'}
              className="block w-full h-auto"
              loading={i < 8 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
