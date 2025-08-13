'use client'

import { motion } from 'framer-motion'
import { BookOpen, Tag as TagIcon, Mail } from 'lucide-react'
import { BlogPostMetadata } from '@/lib/blog'
import BlogCard from '@/components/BlogCard'
import ImageMindscape from '@/components/ImageMindscape'

interface BlogPageClientProps {
  posts: BlogPostMetadata[]
  tags: string[]
}

export default function BlogPageClient({ posts, tags }: BlogPageClientProps) {
  return (
    <div className="min-h-screen relative">
      <ImageMindscape />
      
      <div className="relative z-20 pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 canvas-element mb-8">
              <BookOpen className="text-yellow-500" size={20} />
              <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                Stories & Insights
              </span>
            </div>
            
            <h1 className="chunky-font text-7xl md:text-[10rem] lg:text-[12rem] font-bold mb-8 leading-none"
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #64748b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
              STORIES
            </h1>
            
            <div className="canvas-element p-8 max-w-3xl mx-auto">
              <p className="text-xl text-gray-700 font-medium leading-relaxed">
                <span className="font-bold text-purple-600">Adventures</span>, 
                <span className="font-bold text-blue-600"> tips</span>, and 
                <span className="font-bold text-pink-600"> insights</span> from my journey as a photographer. 
                Join me as I share what I&apos;ve learned behind the lens.
              </p>
            </div>
          </motion.div>

          {/* Featured Tags */}
          {tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-16"
            >
              <div className="canvas-element p-8">
                <h2 className="chunky-font text-3xl font-bold mb-6 text-gray-800 text-center">
                  BROWSE BY TOPIC
                </h2>
                <div className="flex flex-wrap gap-4 justify-center">
                  {tags.map((tag, index) => (
                    <motion.span
                      key={tag}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-bold text-gray-700 hover:from-blue-200 hover:to-purple-200 transition-all cursor-pointer"
                      whileHover={{ 
                        scale: 1.05,
                        rotate: index % 2 === 0 ? 2 : -2
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TagIcon size={14} />
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Blog Posts */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <motion.div 
                  className="canvas-element p-12 max-w-md mx-auto"
                  whileHover={{ scale: 1.02 }}
                >
                  <BookOpen className="mx-auto mb-6 text-gray-400" size={64} />
                  <h3 className="chunky-font text-2xl font-bold mb-4 text-gray-800">
                    NO STORIES YET
                  </h3>
                  <p className="text-gray-600 font-medium">
                    I&apos;m currently out capturing amazing content. 
                    Check back soon for exciting stories!
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div 
              className="canvas-element p-12 max-w-3xl mx-auto"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-center mb-6">
                <Mail className="text-blue-500" size={48} />
              </div>
              
              <h2 className="chunky-font text-4xl font-bold mb-6 text-gray-800">
                STAY UPDATED
              </h2>
              
              <p className="text-xl text-gray-700 font-medium mb-8 leading-relaxed">
                Get notified when I publish new 
                <span className="font-bold text-purple-600"> stories</span> and 
                <span className="font-bold text-blue-600"> photography tips</span>.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-400 font-medium"
                />
                <button className="playful-btn">
                  SUBSCRIBE
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}