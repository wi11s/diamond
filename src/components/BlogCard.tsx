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
    <motion.article
      initial={{ opacity: 0, y: 40, rotate: -5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 200
      }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <motion.div
          className="canvas-element overflow-hidden"
          whileHover={{ 
            scale: 1.05, 
            rotate: index % 3 === 0 ? 2 : index % 3 === 1 ? -2 : 1,
            transition: { duration: 0.3 }
          }}
        >
          <div className="relative h-48 overflow-hidden rounded-xl mb-4">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
                <span className="text-gray-400 text-lg font-bold">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span className="font-medium">{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span className="font-medium">{post.readTime}</span>
              </div>
            </div>
            
            <h2 className="chunky-font text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h2>
            
            <p className="text-gray-600 font-medium mb-6 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 2).map((tag, tagIndex) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full text-xs font-bold text-gray-700"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
              
              <span className="font-bold text-blue-600 text-sm group-hover:underline">
                READ MORE →
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  )
}