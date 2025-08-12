'use client'

import { motion } from 'framer-motion'
import PhotoGallery from '@/components/PhotoGallery'

// Mock data - replace with real Cloudinary data
const mockPhotos = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'Mountain landscape at sunset',
    width: 800,
    height: 600,
    category: 'landscape'
  },
  {
    id: '2', 
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop',
    alt: 'Portrait photography',
    width: 800,
    height: 600,
    category: 'portrait'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    alt: 'Nature photography',
    width: 800,
    height: 600,
    category: 'nature'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    alt: 'Street photography',
    width: 800,
    height: 600,
    category: 'street'
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop',
    alt: 'Male portrait',
    width: 800,
    height: 600,
    category: 'portrait'
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'Landscape view',
    width: 800,
    height: 600,
    category: 'landscape'
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
    alt: 'Ocean waves',
    width: 800,
    height: 600,
    category: 'nature'
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
    alt: 'Urban architecture',
    width: 800,
    height: 600,
    category: 'street'
  }
]

const categories = ['landscape', 'portrait', 'nature', 'street']

export default function Photos() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            Photography
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A curated collection of my favorite shots, each capturing a unique 
            moment in time and telling its own story.
          </p>
        </motion.div>

        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PhotoGallery photos={mockPhotos} categories={categories} />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="glass-effect p-8 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Like what you see?</h2>
            <p className="text-gray-300 mb-6">
              I&apos;m always looking for new projects and collaborations. 
              Let&apos;s create something beautiful together.
            </p>
            <a
              href="mailto:taylor@example.com"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}