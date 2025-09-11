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

          photos = photosResult.resources
            .filter((resource: any) => {
              // Only include images that are actually in this subfolder
              const expectedFolderPath = `PORTRAIT PHOTOGRAPHY/${subfolder.name}`
              const actualFolderPath = resource.asset_folder || resource.folder
              return actualFolderPath === expectedFolderPath
            })
            .map((resource: any) => {
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
            // Process the original name to handle priority marker and numeric prefix
            let processedName = subfolder.name
            let isPriority = false
            let numericOrder: number | null = null

            // Check if this is a priority folder (starts with *)
            if (processedName.startsWith('*')) {
              isPriority = true
              processedName = processedName.substring(1).trim() // Remove the * and any following whitespace
            }

            // Extract numeric prefix like "10.", "9.", etc., and strip it from name
            const numberMatch = processedName.match(/^\s*(\d+)\.\s*(.*)$/)
            if (numberMatch) {
              numericOrder = parseInt(numberMatch[1], 10)
              processedName = numberMatch[2]
            }

            // Then clean up escaped quotes
            const cleanName = processedName.replace(/\\"/g, '"')

            const displayName = (cleanName || '').trim()

            photoShoots.push({
              name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
              photos: photos,
              priority: isPriority,
              orderIndex: typeof numericOrder === 'number' ? numericOrder : undefined,
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
        priority: false
      })
    }

    // Sort photo shoots: priority first, then numeric prefix (desc), then alphabetically
    photoShoots.sort((a: any, b: any) => {
      // Priority folders come first
      if (a.priority && !b.priority) return -1
      if (!a.priority && b.priority) return 1

      const aNum = typeof a.orderIndex === 'number' ? a.orderIndex : null
      const bNum = typeof b.orderIndex === 'number' ? b.orderIndex : null

      // If both have numeric prefixes, sort by descending number (10, 9, 8, ...)
      if (aNum !== null && bNum !== null) return bNum - aNum
      // If only one has numeric prefix, it comes first
      if (aNum !== null && bNum === null) return -1
      if (aNum === null && bNum !== null) return 1

      // Fallback: alphabetical by name
      return a.name.localeCompare(b.name)
    })

    // If we couldn't fetch folders or found nothing, fall back to local data
    if (!folders || folders.length === 0 || photoShoots.length === 0) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const localData = require('@/data/cloudinary-data.json')
        // Rebuild src URLs to ensure non-cropped fit
        return localData.map((shoot: any) => ({
          ...shoot,
          photos: (shoot.photos || []).map((p: any) => ({
            ...p,
            src: buildImageUrl(p.public_id || p.id, 'w_2400,c_fit,q_auto,f_auto,dpr_auto')
          }))
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
        photos: (shoot.photos || []).map((p: any) => ({
          ...p,
          src: buildImageUrl(p.public_id || p.id, 'w_2400,c_fit,q_auto,f_auto,dpr_auto')
        }))
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

// Fetch all landscape photos (flattened) from the LANDSCAPE AND TRAVEL PHOTOGRAPHY folder
export async function getLandscapePhotos() {
  try {
    const ROOT = 'LANDSCAPE AND TRAVEL PHOTOGRAPHY'

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
