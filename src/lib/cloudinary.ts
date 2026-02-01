import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary (these values should come from environment variables)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryImage {
  public_id: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
  url: string
  secure_url: string
  folder?: string
  tags?: string[]
}

export async function getImages(folder?: string): Promise<CloudinaryImage[]> {
  try {
    const results = await cloudinary.search
      .expression(folder ? `folder:${folder}` : 'resource_type:image')
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute()

    return results.resources
  } catch (error) {
    console.error('Error fetching images from Cloudinary:', error)
    return []
  }
}

export async function getImagesByTag(tag: string): Promise<CloudinaryImage[]> {
  try {
    const results = await cloudinary.search
      .expression(`tags:${tag}`)
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute()

    return results.resources
  } catch (error) {
    console.error('Error fetching images by tag from Cloudinary:', error)
    return []
  }
}

export async function getFolders(): Promise<any[]> {
  try {
    // Short-circuit if env not configured
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return []
    }
    const results = await cloudinary.api.sub_folders('')
    return results.folders
  } catch (error) {
    // Downgrade to warn to avoid noisy server errors in dev; fallback logic will handle it
    console.warn('Cloudinary folders unavailable; using fallback.')
    return []
  }
}

export async function getPhotoShoots() {
  try {
    let folders = await getFolders()
    const photoShoots: any[] = []
    
    // Find the portrait photography folder
    const portraitFolder = folders.find(f => f.name === 'PORTRAIT PHOTOGRAPHY')
    
    if (portraitFolder) {
      // Get subfolders within portrait photography
      const portraitSubfoldersResult = await cloudinary.api.sub_folders(portraitFolder.path)
      const portraitSubfolders = portraitSubfoldersResult.folders

      // For each portrait subfolder, get all images
      for (const subfolder of portraitSubfolders) {
        let photosResult
        let photos = []

        try {
          console.log(`Searching for photos in: ${subfolder.path}`)
          
          // Start with escaped path search for folders with special characters
          let searchPath = subfolder.path.replace(/"/g, '\\"')
          
          // Handle asterisk character which can cause search issues
          if (searchPath.includes('*')) {
            console.log(`Path contains *, escaping it: ${searchPath}`)
            searchPath = searchPath.replace(/\*/g, '\\*')
          }
          
          console.log(`Escaped path: ${searchPath}`)
          
          photosResult = await cloudinary.search
            .expression(`folder:"${searchPath}"`)
            .sort_by('created_at', 'desc')
            .max_results(100)
            .execute()

          console.log(`Escaped search found ${photosResult.resources.length} resources`)

          // If no results, try direct folder search
          if (photosResult.resources.length === 0) {
            console.log(`Trying direct folder search...`)
            photosResult = await cloudinary.search
              .expression(`folder:${subfolder.path}`)
              .sort_by('created_at', 'desc')
              .max_results(100)
              .execute()
            
            console.log(`Direct search found ${photosResult.resources.length} resources`)
          }

          const filtered = photosResult.resources.filter((resource: any) => {
            // Only include images that are actually in this subfolder
            const expectedFolderPath = `PORTRAIT PHOTOGRAPHY/${subfolder.name}`
            const actualFolderPath = resource.asset_folder || resource.folder
            return actualFolderPath === expectedFolderPath
          })

          // Sort photos by display_name A–Z (case-insensitive). Fallback to filename if missing.
          const sorted = filtered
            .map((resource: any, index: number) => ({
              resource,
              index,
              name: (
                resource.display_name ||
                (resource.public_id || '').split('/').pop() ||
                ''
              ).toString()
            }))
            .sort((a: any, b: any) => {
              const an = a.name.toLowerCase()
              const bn = b.name.toLowerCase()
              const cmp = an.localeCompare(bn, undefined, { sensitivity: 'base' })
              if (cmp !== 0) return cmp
              // Stable by original index
              return a.index - b.index
            })
            .map(({ resource }: any) => resource)

          photos = sorted.map((resource: any) => {
            // Preserve original aspect ratio; deliver reasonably large width
            const imageUrl = cloudinary.url(resource.public_id, {
              quality: 'auto',
              fetch_format: 'auto',
              width: 2400,
              crop: 'fit',
              dpr: 'auto'
            })

            return {
              id: resource.public_id,
              src: imageUrl,
              alt: resource.display_name || subfolder.name,
              width: resource.width || 2400,
              height: resource.height || 1600,
              public_id: resource.public_id
            }
          })

          // Only add shoots that have photos
          if (photos.length > 0) {
            // Keep original folder name; no renaming/sorting here
            photoShoots.push({
              name: subfolder.name,
              photos: photos,
            })
          }
        } catch (error) {
          console.error(`Error fetching photos for ${subfolder.name}:`, error)
          console.error('Error details:', JSON.stringify(error, null, 2))
        }
      }
    }

    // Add placeholder for landscape/travel section
    const landscapeFolder = folders.find(f => f.name === 'LANDSCAPE AND TRAVEL PHOTOGRAPHY')
    if (landscapeFolder) {
      photoShoots.push({
        name: 'Landscape & Travel',
        photos: [], // Placeholder - will be implemented later
      })
    }

    // No sorting here; frontend will sort by numeric prefixes as needed

    // If we couldn't fetch folders or found nothing, fall back to local data
    if (!folders || folders.length === 0 || photoShoots.length === 0) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const localData = require('@/data/cloudinary-data.json')
        // Rebuild src URLs to ensure non-cropped fit
        return localData.map((shoot: any) => ({
          ...shoot,
          photos: (shoot.photos || [])
            .map((p: any) => ({
              ...p,
              src: buildImageUrl(p.public_id || p.id, 'w_2400,c_fit,q_auto,f_auto,dpr_auto')
            }))
            .sort((a: any, b: any) => {
              const an = (a.display_name || a.alt || a.id || '').toString().toLowerCase()
              const bn = (b.display_name || b.alt || b.id || '').toString().toLowerCase()
              return an.localeCompare(bn, undefined, { sensitivity: 'base' })
            })
        }))
      } catch (e) {
        console.error('Failed to load local Cloudinary data:', e)
        return []
      }
    }

    return photoShoots
  } catch (error) {
    console.warn('Falling back to local Cloudinary data for photo shoots.')
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const localData = require('@/data/cloudinary-data.json')
      return localData.map((shoot: any) => ({
        ...shoot,
        photos: (shoot.photos || [])
          .map((p: any) => ({
            ...p,
            src: buildImageUrl(p.public_id || p.id, 'w_2400,c_fit,q_auto,f_auto,dpr_auto')
          }))
          .sort((a: any, b: any) => {
            const an = (a.display_name || a.alt || a.id || '').toString().toLowerCase()
            const bn = (b.display_name || b.alt || b.id || '').toString().toLowerCase()
            return an.localeCompare(bn, undefined, { sensitivity: 'base' })
          })
      }))
    } catch (e) {
      return []
    }
  }
}

export function buildImageUrl(publicId: string, transformations?: string): string {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
  
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`
  }
  
  return `${baseUrl}/${publicId}`
}

// Common transformation presets
export const imageTransforms = {
  thumbnail: 'w_300,h_300,c_fill,q_auto,f_auto',
  medium: 'w_800,h_600,c_fit,q_auto,f_auto', 
  large: 'w_1200,h_900,c_fit,q_auto,f_auto',
  hero: 'w_1920,h_1080,c_fill,q_auto,f_auto',
}

// Fetch a single DJ headshot image by name pattern
export async function getDjHeadshot() {
  try {
    const QUERY = 'DJHEADSHOT'
    const ROOT = 'DJ'

    const make = (r: any) => ({
      id: r.public_id,
      src: cloudinary.url(r.public_id, {
        quality: 'auto',
        fetch_format: 'auto',
        width: 1600,
        crop: 'fit',
        dpr: 'auto'
      }),
      alt: r.display_name || 'DJ Headshot',
      width: r.width || 1600,
      height: r.height || 1200,
      public_id: r.public_id,
    })

    // Try precise search inside DJ and subfolders
    const expr = `resource_type:image AND (folder:${ROOT} OR folder:${ROOT}/*) AND (public_id:${QUERY}* OR filename:${QUERY}* OR display_name:${QUERY}*)`
    const res = await cloudinary.search
      .expression(expr)
      .sort_by('created_at', 'desc')
      .max_results(5)
      .execute()

    const first = (res?.resources || [])[0]
    if (first) return make(first)

    // Fallback: direct public id
    const fallbackId = `${ROOT}/${QUERY}`
    return {
      id: fallbackId,
      src: buildImageUrl(fallbackId, 'w_1600,c_fit,q_auto,f_auto,dpr_auto'),
      alt: 'DJ Headshot',
      width: 1600,
      height: 1200,
      public_id: fallbackId,
    }
  } catch (_) {
    return null
  }
}

// Fetch featured DJ photos (exclude fliers)
export async function getDjPhotos(limit = 3) {
  try {
    const ROOT = 'DJ'

    const buildPhoto = (resource: any, altFallback: string) => ({
      id: resource.public_id,
      src: cloudinary.url(resource.public_id, {
        quality: 'auto',
        fetch_format: 'auto',
        width: 2400,
        crop: 'fit',
        dpr: 'auto'
      }),
      alt: resource.display_name || altFallback,
      width: resource.width || 2400,
      height: resource.height || 1600,
      public_id: resource.public_id
    })

    const collected: any[] = []

    // Pull from ROOT and subfolders; filter out obvious fliers by id
    try {
      const rootSearch = await cloudinary.search
        .expression(`folder:\"${ROOT}\"`)
        .sort_by('created_at', 'desc')
        .max_results(100)
        .execute()

      const recursiveSearch = await cloudinary.search
        .expression(`folder:${ROOT}/*`)
        .sort_by('created_at', 'desc')
        .max_results(200)
        .execute()

      const all = [...(rootSearch?.resources || []), ...(recursiveSearch?.resources || [])]
      const seen = new Set<string>()
      const photos = all
        .filter((r: any) => {
          const id = (r.public_id || '').toLowerCase()
          // Try to exclude fliers by id substring as folder metadata may be missing in results
          if (id.includes('/fliers/') || id.includes('/flyers/') || id.includes('flier') || id.includes('flyer')) return false
          if (seen.has(r.public_id)) return false
          seen.add(r.public_id)
          return true
        })
        .map((r: any) => buildPhoto(r, ROOT))

      collected.push(...photos)
    } catch (e) {
      // ignore, fall through
    }

    // Return top N
    if (collected.length > 0) return collected.slice(0, limit)
    return []
  } catch (error) {
    console.warn('DJ photos unavailable; returning empty list.')
    return []
  }
}

// Fetch DJ fliers/flyers for collage
export async function getDjFliers(limit = 24) {
  try {
    const ROOT = 'DJ'
    const SUBS = ['FLIERS', 'FLYERS']

    const buildPhoto = (resource: any, altFallback: string) => ({
      id: resource.public_id,
      src: cloudinary.url(resource.public_id, {
        quality: 'auto',
        fetch_format: 'auto',
        width: 1000,
        crop: 'fit',
        dpr: 'auto'
      }),
      alt: resource.display_name || altFallback,
      width: resource.width || 1000,
      height: resource.height || 1000,
      public_id: resource.public_id
    })

    const collected: any[] = []

    for (const sub of SUBS) {
      try {
        const path = `${ROOT}/${sub}`
        const escaped = path.replace(/"/g, '\\\"').replace(/\*/g, '\\\\*')
        const search = await cloudinary.search
          .expression(`folder:\"${escaped}\"`)
          .sort_by('created_at', 'desc')
          .max_results(limit)
          .execute()

        const items = (search?.resources || [])
          // Some accounts omit folder metadata on search response; trust the folder expression and avoid over-filtering
          .map((r: any) => buildPhoto(r, sub))

        collected.push(...items)
      } catch (e) {
        // ignore
      }
    }

    return collected.slice(0, limit)
  } catch (error) {
    console.warn('DJ fliers unavailable; returning empty list.')
    return []
  }
}

// Fetch landscape photo shoots grouped by subfolder (same shape as getPhotoShoots)
export async function getLandscapePhotoShoots() {
  try {
    const ROOT = 'LANDSCAPE'
    const photoShoots: any[] = []

    // Try subfolders API first
    try {
      const subfoldersResult = await cloudinary.api.sub_folders(ROOT)
      const subfolders = subfoldersResult.folders

      for (const subfolder of subfolders) {
        try {
          let searchPath = subfolder.path.replace(/"/g, '\\"')
          if (searchPath.includes('*')) {
            searchPath = searchPath.replace(/\*/g, '\\*')
          }

          let photosResult = await cloudinary.search
            .expression(`folder:"${searchPath}"`)
            .sort_by('created_at', 'desc')
            .max_results(100)
            .execute()

          if (photosResult.resources.length === 0) {
            photosResult = await cloudinary.search
              .expression(`folder:${subfolder.path}`)
              .sort_by('created_at', 'desc')
              .max_results(100)
              .execute()
          }

          const filtered = photosResult.resources.filter((resource: any) => {
            const expectedFolderPath = `${ROOT}/${subfolder.name}`
            const actualFolderPath = resource.asset_folder || resource.folder
            return actualFolderPath === expectedFolderPath
          })

          const sorted = filtered
            .map((resource: any, index: number) => ({
              resource,
              index,
              name: (
                resource.display_name ||
                (resource.public_id || '').split('/').pop() ||
                ''
              ).toString()
            }))
            .sort((a: any, b: any) => {
              const an = a.name.toLowerCase()
              const bn = b.name.toLowerCase()
              const cmp = an.localeCompare(bn, undefined, { sensitivity: 'base' })
              if (cmp !== 0) return cmp
              return a.index - b.index
            })
            .map(({ resource }: any) => resource)

          const photos = sorted.map((resource: any) => ({
            id: resource.public_id,
            src: cloudinary.url(resource.public_id, {
              quality: 'auto',
              fetch_format: 'auto',
              width: 2400,
              crop: 'fit',
              dpr: 'auto'
            }),
            alt: resource.display_name || subfolder.name,
            width: resource.width || 2400,
            height: resource.height || 1600,
            public_id: resource.public_id
          }))

          if (photos.length > 0) {
            photoShoots.push({
              name: subfolder.name,
              photos,
            })
          }
        } catch (error) {
          console.error(`Error fetching landscape photos for ${subfolder.name}:`, error)
        }
      }
    } catch (e) {
      console.warn('Landscape subfolders unavailable.')
    }

    // If we found shoots, return them
    if (photoShoots.length > 0) return photoShoots

    // Fallback: flatten all landscape photos into a single shoot
    const flatPhotos = await getLandscapePhotos()
    if (flatPhotos.length > 0) {
      return [{ name: 'Landscape & Travel', photos: flatPhotos }]
    }

    return []
  } catch (error) {
    console.warn('Falling back to flat landscape photos.')
    const flatPhotos = await getLandscapePhotos()
    if (flatPhotos.length > 0) {
      return [{ name: 'Landscape & Travel', photos: flatPhotos }]
    }
    return []
  }
}

// Fetch all landscape photos (flattened) from the LANDSCAPE folder
export async function getLandscapePhotos() {
  try {
    const ROOT = 'LANDSCAPE'

    const buildPhoto = (resource: any, altFallback: string) => ({
      id: resource.public_id,
      src: cloudinary.url(resource.public_id, {
        quality: 'auto',
        fetch_format: 'auto',
        width: 2400,
        crop: 'fit',
        dpr: 'auto'
      }),
      alt: resource.display_name || altFallback,
      width: resource.width || 2400,
      height: resource.height || 1600,
      public_id: resource.public_id
    })

    const collected: any[] = []

    // Attempt direct search without listing folders
    try {
      const rootSearch = await cloudinary.search
        .expression(`folder:"${ROOT}"`)
        .sort_by('created_at', 'desc')
        .max_results(100)
        .execute()

      const recursiveSearch = await cloudinary.search
        .expression(`folder:${ROOT}/*`)
        .sort_by('created_at', 'desc')
        .max_results(200)
        .execute()

      const all = [...(rootSearch?.resources || []), ...(recursiveSearch?.resources || [])]
      if (all.length > 0) {
        const photos = all
          .filter((r: any) => {
            const folder = r.asset_folder || r.folder || ''
            return folder === ROOT || folder.startsWith(`${ROOT}/`)
          })
          .map((r: any) => buildPhoto(r, ROOT))
        collected.push(...photos)
      }
    } catch (e) {
      // ignore and fall back
    }

    // If still empty, try subfolders API
    if (collected.length === 0) {
      try {
        const landscapeSubfoldersResult = await cloudinary.api.sub_folders(ROOT)
        const subfolders = landscapeSubfoldersResult.folders

        for (const subfolder of subfolders) {
          try {
            let searchPath = subfolder.path.replace(/"/g, '\\"')
            if (searchPath.includes('*')) {
              searchPath = searchPath.replace(/\*/g, '\\*')
            }

            let photosResult = await cloudinary.search
              .expression(`folder:"${searchPath}"`)
              .sort_by('created_at', 'desc')
              .max_results(100)
              .execute()

            if (photosResult.resources.length === 0) {
              photosResult = await cloudinary.search
                .expression(`folder:${subfolder.path}`)
                .sort_by('created_at', 'desc')
                .max_results(100)
                .execute()
            }

            const photos = photosResult.resources
              .filter((resource: any) => {
                const expectedFolderPath = `${ROOT}/${subfolder.name}`
                const actualFolderPath = resource.asset_folder || resource.folder
                return actualFolderPath === expectedFolderPath
              })
              .map((resource: any) => buildPhoto(resource, subfolder.name))

            collected.push(...photos)
          } catch (error) {
            console.error(`Error fetching landscape photos for ${subfolder.name}:`, error)
          }
        }
      } catch (e) {
        // ignore
      }
    }

    if (collected.length > 0) return collected

    // Final fallback: local JSON
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const localData = require('@/data/cloudinary-data.json')
      const landscape = (localData || []).find((s: any) => s.name === 'Landscape & Travel')
      const photos = (landscape?.photos || []).map((p: any) => ({
        ...p,
        src: buildImageUrl(p.public_id || p.id, 'w_2400,c_fit,q_auto,f_auto,dpr_auto')
      }))
      return photos
    } catch (e) {
      return []
    }
  } catch (error) {
    console.warn('Falling back to local Cloudinary data for landscape photos.')
    return []
  }
}
