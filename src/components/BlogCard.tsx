'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Tag } from 'lucide-react'
import { BlogPostMetadata } from '@/lib/blog'

interface BlogCardProps {
  post: BlogPostMetadata
  index?: number
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  return (
    <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="border border-gray-200 overflow-hidden">
          <div className="relative h-48 overflow-hidden mb-4">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span className="font-medium">{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span className="font-medium">{post.readTime}</span>
              </div>
            </div>
            
            <h2 className="chunky-font text-xl font-medium mb-2 text-gray-900 line-clamp-2">
              {post.title}
            </h2>
            
            <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 2).map((tag, tagIndex) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 border border-gray-300 text-xs text-gray-700"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
              
              <span className="text-gray-700 text-sm">
                Read more →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}