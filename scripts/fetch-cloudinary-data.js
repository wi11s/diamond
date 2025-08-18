const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function fetchCloudinaryData() {
  try {
    console.log('Fetching Cloudinary folders...');

    // Get all folders
    const foldersResult = await cloudinary.api.sub_folders('');
    const folders = foldersResult.folders;

    console.log(`Found ${folders.length} folders:`, folders.map(f => f.name));

    const photoShoots = [];

    // Find the portrait photography folder
    const portraitFolder = folders.find(f => f.name === 'PORTRAIT PHOTOGRAPHY');
    
    if (portraitFolder) {
      console.log('Processing PORTRAIT PHOTOGRAPHY folder...');
      
      // Get subfolders within portrait photography
      const portraitSubfoldersResult = await cloudinary.api.sub_folders(portraitFolder.path);
      const portraitSubfolders = portraitSubfoldersResult.folders;
      
      console.log(`Found ${portraitSubfolders.length} portrait subfolders:`, portraitSubfolders.map(f => f.name));

      // For each portrait subfolder, get all images
      for (const subfolder of portraitSubfolders) {
        console.log(`Fetching photos from portrait subfolder: ${subfolder.name}`);
        console.log(`  Folder path: ${subfolder.path}`);

        // Try multiple search strategies
        let photosResult;
        let photos = [];

        try {
          // Start with the most reliable search strategy - escaped path
          let searchPath = subfolder.path.replace(/"/g, '\\"');
          
          // Handle asterisk character which can cause search issues
          if (searchPath.includes('*')) {
            console.log(`  Path contains *, escaping it: ${searchPath}`);
            searchPath = searchPath.replace(/\*/g, '\\*');
          }
          
          console.log(`  Trying escaped path search: ${searchPath}`);
          photosResult = await cloudinary.search
            .expression(`folder:"${searchPath}"`)
            .sort_by('created_at', 'desc')
            .max_results(100)
            .execute();
          
          console.log(`  Escaped path search found ${photosResult.resources.length} resources`);

          // If escaped path didn't work, try direct folder search
          if (photosResult.resources.length === 0) {
            console.log(`  Trying direct folder search...`);
            photosResult = await cloudinary.search
              .expression(`folder:${subfolder.path}`)
              .sort_by('created_at', 'desc')
              .max_results(100)
              .execute();

            console.log(`  Direct folder search found ${photosResult.resources.length} resources`);
          }

          // Last resort: recursive search
          if (photosResult.resources.length === 0) {
            console.log(`  Trying recursive search...`);
            photosResult = await cloudinary.search
              .expression(`folder:${subfolder.path}/*`)
              .sort_by('created_at', 'desc')
              .max_results(100)
              .execute();
            
            console.log(`  Recursive search found ${photosResult.resources.length} resources`);
          }

          photos = photosResult.resources
            .filter(resource => {
              // Only include images that are actually in this subfolder
              const expectedFolderPath = subfolder.path;
              const actualFolderPath = resource.asset_folder || resource.folder;
              return actualFolderPath === expectedFolderPath;
            })
            .map(resource => {
              // Generate URL without forced dimensions for images that are smaller
              const useOriginalSize = resource.width < 1200 || resource.height < 800;
              
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
                  });


              return {
                id: resource.public_id,
                src: imageUrl,
                alt: resource.display_name || subfolder.name,
                width: resource.width || 2400,
                height: resource.height || 1600,
                public_id: resource.public_id
              };
            });

        } catch (error) {
          console.error(`  Error searching folder ${subfolder.name}:`, error.message);
        }

        // Only add shoots that have photos
        if (photos.length > 0) {
          // Process the original name to handle priority marker first
          let processedName = subfolder.name;
          let isPriority = false;
          
          // Check if this is a priority folder (starts with *)
          if (processedName.startsWith('*')) {
            isPriority = true;
            processedName = processedName.substring(1).trim(); // Remove the * and any following whitespace
          }
          
          // Then clean up escaped quotes
          const cleanName = processedName.replace(/\\"/g, '"');
          
          photoShoots.push({
            name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
            photos: photos,
            priority: isPriority
          });
        }

        console.log(`  Found ${photos.length} photos in ${subfolder.name}`);
      }
    }

    // Add placeholder for landscape/travel section
    const landscapeFolder = folders.find(f => f.name === 'LANDSCAPE AND TRAVEL PHOTOGRAPHY');
    if (landscapeFolder) {
      console.log('Adding placeholder for LANDSCAPE AND TRAVEL PHOTOGRAPHY...');
      photoShoots.push({
        name: 'Landscape & Travel',
        photos: [], // Placeholder - will be implemented later
        priority: false
      });
    }

    // Sort photo shoots: priority folders first, then alphabetically
    photoShoots.sort((a, b) => {
      // Priority folders come first
      if (a.priority && !b.priority) return -1;
      if (!a.priority && b.priority) return 1;
      
      // Within same priority level, sort alphabetically
      return a.name.localeCompare(b.name);
    });

    console.log('\nFinal order after sorting:');
    photoShoots.forEach((shoot, index) => {
      const priorityMark = shoot.priority ? '⭐ ' : '   ';
      console.log(`${index + 1}. ${priorityMark}${shoot.name} (${shoot.photos.length} photos)`);
    });

    // Write the data to a JSON file
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'cloudinary-data.json');
    
    // Ensure the data directory exists
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(photoShoots, null, 2));

    console.log(`\nData saved to: ${outputPath}`);
    console.log(`Total photo shoots: ${photoShoots.length}`);
    console.log(`Total photos: ${photoShoots.reduce((sum, shoot) => sum + shoot.photos.length, 0)}`);

    return photoShoots;

  } catch (error) {
    console.error('Error fetching Cloudinary data:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  fetchCloudinaryData();
}

module.exports = { fetchCloudinaryData };