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
    const results = await cloudinary.api.sub_folders('')
    return results.folders
  } catch (error) {
    console.error('Error fetching folders from Cloudinary:', error)
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
            // Process the original name to handle priority marker first
            let processedName = subfolder.name
            let isPriority = false
            
            // Check if this is a priority folder (starts with *)
            if (processedName.startsWith('*')) {
              isPriority = true
              processedName = processedName.substring(1).trim() // Remove the * and any following whitespace
            }
            
            // Then clean up escaped quotes
            const cleanName = processedName.replace(/\\"/g, '"')
            
            photoShoots.push({
              name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
              photos: photos,
              priority: isPriority
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

    // Sort photo shoots: priority folders first, then alphabetically
    photoShoots.sort((a, b) => {
      // Priority folders come first
      if (a.priority && !b.priority) return -1
      if (!a.priority && b.priority) return 1
      
      // Within same priority level, sort alphabetically
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
    console.error('Error fetching photo shoots from Cloudinary:', error)
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
    const folders = await getFolders()
    const landscapeFolder = folders.find(f => f.name === 'LANDSCAPE AND TRAVEL PHOTOGRAPHY')
    if (!landscapeFolder) return []

    const landscapeSubfoldersResult = await cloudinary.api.sub_folders(landscapeFolder.path)
    const subfolders = landscapeSubfoldersResult.folders

    const allPhotos: any[] = []

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
            const expectedFolderPath = `LANDSCAPE AND TRAVEL PHOTOGRAPHY/${subfolder.name}`
            const actualFolderPath = resource.asset_folder || resource.folder
            return actualFolderPath === expectedFolderPath
          })
          .map((resource: any) => {
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

        allPhotos.push(...photos)
      } catch (error) {
        console.error(`Error fetching landscape photos for ${subfolder.name}:`, error)
      }
    }

    return allPhotos
  } catch (error) {
    console.error('Error fetching landscape photos:', error)
    return []
  }
}