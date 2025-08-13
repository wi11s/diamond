'use client'

import { motion } from 'framer-motion'
import { BookOpen, Tag as TagIcon } from 'lucide-react'
import { BlogPostMetadata } from '@/lib/blog'
import BlogCard from '@/components/BlogCard'

interface BlogPageClientProps {
  posts: BlogPostMetadata[]
  tags: string[]
}

export default function BlogPageClient({ posts, tags }: BlogPageClientProps) {
  return (
    <div className="min-h-screen bg-white text-black overflow-auto">
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <BookOpen size={20} />
              <span className="text-sm font-medium uppercase tracking-wider text-gray-600">
                Stories & Insights
              </span>
            </div>

            <h1 className="chunky-font text-5xl md:text-7xl font-light mb-6 leading-none text-black">
              STORIES
            </h1>
            
            <p className="max-w-3xl mx-auto text-base text-gray-700 leading-relaxed">
              Adventures, tips, and insights from my journey as a photographer.
            </p>
          </motion.div>

          {/* Featured Tags */}
          {tags.length > 0 && (
            <div className="mb-10">
              <h2 className="chunky-font text-xl font-medium mb-4 text-center">
                Browse by topic
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 border border-gray-300 text-gray-700 text-sm"
                  >
                    <TagIcon size={14} />
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Blog Posts */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="max-w-md mx-auto">
                  <BookOpen className="mx-auto mb-4 text-gray-400" size={40} />
                  <h3 className="chunky-font text-xl font-medium mb-2 text-gray-900">
                    No stories yet
                  </h3>
                  <p className="text-gray-600">
                    I&apos;m currently out capturing content. Check back soon.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}