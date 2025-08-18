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
    const folders = await getFolders()
    const photoShoots = []
    
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
            .filter(resource => {
              // Only include images that are actually in this subfolder
              const expectedFolderPath = `PORTRAIT PHOTOGRAPHY/${subfolder.name}`
              const actualFolderPath = resource.asset_folder || resource.folder
              return actualFolderPath === expectedFolderPath
            })
            .map(resource => {
              // Generate URL without forced dimensions for smaller images
              const useOriginalSize = resource.width < 1200 || resource.height < 800
              
              const imageUrl = useOriginalSize 
                ? cloudinary.url(resource.public_id, {
                    quality: 'auto',
                    fetch_format: 'auto'
                  })
                : cloudinary.url(resource.public_id, {
                    quality: 'auto',
                    fetch_format: 'auto',
                    width: 2400,
                    height: 1600,
                    crop: 'fill'
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

    return photoShoots
  } catch (error) {
    console.error('Error fetching photo shoots from Cloudinary:', error)
    return []
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