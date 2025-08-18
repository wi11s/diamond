# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Taylor Diamond's photography portfolio website built with Next.js 15, TypeScript, and modern web technologies. Features include:
- Cloudinary-powered photo gallery with priority folder system
- Vertical scrolling sections with horizontal photo rows
- Real-time Cloudinary API integration
- Dynamic photo shoot organization
- Fully responsive design with Tailwind CSS

## Development Commands

```bash
# Install dependencies
npm install --legacy-peer-deps

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check

# Fetch Cloudinary data
npm run fetch-cloudinary
```

## Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── dates/             # Dates page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage with photo gallery
├── components/            # Reusable components
│   ├── Navigation.tsx     # Main navigation component
│   ├── PhotoGallery.tsx   # Photo gallery with vertical/horizontal scrolling
│   ├── ImageMindscape.tsx # Image component
│   └── SocialDock.tsx     # Social media links
├── lib/                   # Utility functions
│   └── cloudinary.ts      # Cloudinary integration with priority folders
├── data/                  # Generated data files
│   └── cloudinary-data.json # Cached Cloudinary photo data
└── types/                 # TypeScript type definitions

scripts/
└── fetch-cloudinary-data.js # Script to fetch and cache Cloudinary data
```

### Key Technologies
- **Next.js 15** with App Router and TypeScript
- **Cloudinary** for image management and API
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### Cloudinary Integration
- Configure environment variables in `.env.local`:
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Image transformations are handled via `src/lib/cloudinary.ts`
- Dynamic photo loading from Cloudinary folders
- Priority folder system (folders starting with `*` appear first)
- Cached data generation via `npm run fetch-cloudinary`

### Photo Gallery System
- **Vertical scrolling**: Each photo shoot gets its own full-screen section
- **Horizontal scrolling**: Photos within each section scroll horizontally
- **Priority folders**: Cloudinary folders starting with `*` appear at the top
- **Real-time integration**: Can load data directly from Cloudinary API
- **Cached mode**: Pre-generated JSON data for faster loading
- **Responsive design**: Works on all screen sizes

### Styling Conventions
- Dark theme with glass morphism effects
- Custom CSS utilities in `globals.css`
- Gradient text effects with `.text-gradient` class
- Glass effect styling with `.glass-effect` class
- Responsive design with mobile-first approach

## Adding Content

### Photos
1. **Upload to Cloudinary**: Organize photos in the "PORTRAIT PHOTOGRAPHY" folder
2. **Create subfolders**: Each subfolder becomes a section in the portfolio
3. **Priority folders**: Prefix folder names with `*` to make them appear first
4. **Update data**: Run `npm run fetch-cloudinary` to update the portfolio
5. **Automatic deployment**: The app fetches fresh data on each build

### Priority Folder Examples
- `*2025 FEATURED WORK` → Appears first, displays as "2025 Featured Work"
- `*BEST OF 2024` → Appears second, displays as "Best Of 2024"  
- `2023 ZEMETA RUNWAY SHOW` → Appears after priority folders, sorted alphabetically

## Development Notes

- Uses `--legacy-peer-deps` for React 19 compatibility
- Images are optimized via Next.js Image component and Cloudinary transformations
- Full-screen sections with smooth scrolling behavior
- Hidden scrollbars for clean aesthetic
- Real-time Cloudinary API integration with fallback to cached data

## Deployment

- Build artifacts go to `.next/` directory
- Static files served from `public/` 
- Environment variables required for Cloudinary
- Recommended platforms: Vercel, Netlify, or any Node.js host


