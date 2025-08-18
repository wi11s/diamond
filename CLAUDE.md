# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Taylor Diamond's photography portfolio website built with Next.js 15, TypeScript, and modern web technologies. Features include:
- Interactive 3D homepage with React Three Fiber
- Cloudinary-powered photo gallery
- Markdown-based blog system
- Creative navigation and animations
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
```

## Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── blog/              # Blog listing and individual posts
│   ├── photos/            # Photo gallery
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── Navigation.tsx     # Main navigation component
│   ├── Scene3D.tsx        # 3D scene for homepage
│   ├── PhotoGallery.tsx   # Photo gallery with lightbox
│   └── BlogCard.tsx       # Blog post preview card
├── lib/                   # Utility functions
│   ├── cloudinary.ts      # Cloudinary integration
│   └── blog.ts            # Blog post management
└── types/                 # TypeScript type definitions

content/
└── blog/                  # Markdown blog posts
```

### Key Technologies
- **Next.js 15** with App Router and TypeScript
- **React Three Fiber** + **Three.js** for 3D graphics
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Cloudinary** for image management
- **Gray Matter** + **Remark** for markdown processing

### Cloudinary Integration
- Configure environment variables in `.env.local`:
  - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Image transformations are handled via `src/lib/cloudinary.ts`
- Photos page uses mock data but is ready for Cloudinary integration

### Blog System
- Markdown files in `content/blog/` directory
- Frontmatter for metadata (title, date, tags, etc.)
- Automatic slug generation from filename
- Static generation for all blog posts
- Easy content management - just add `.md` files

### Styling Conventions
- Dark theme with glass morphism effects
- Custom CSS utilities in `globals.css`
- Gradient text effects with `.text-gradient` class
- Glass effect styling with `.glass-effect` class
- Responsive design with mobile-first approach

## Adding Content

### Blog Posts
Create new markdown files in `content/blog/` with this frontmatter:
```yaml
---
title: "Post Title"
excerpt: "Brief description"
date: "YYYY-MM-DD"
author: "Taylor Diamond"
tags: ["tag1", "tag2"]
coverImage: "https://image-url.jpg"
readTime: "5 min read"
---
```

### Photos
- Upload to Cloudinary and organize in folders
- Update photo gallery to fetch from Cloudinary API
- Categories can be managed via Cloudinary tags or folders

## Development Notes

- Uses `--legacy-peer-deps` for React 19 compatibility
- 3D scenes may impact performance on lower-end devices
- Images are optimized via Next.js Image component
- Navigation includes scroll-based transparency effects
- All animations use Framer Motion for consistency

## Deployment

- Build artifacts go to `.next/` directory
- Static files served from `public/` 
- Environment variables required for Cloudinary
- Recommended platforms: Vercel, Netlify, or any Node.js host


