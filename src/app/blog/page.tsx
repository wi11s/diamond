import { motion } from 'framer-motion'
import { getAllPosts, getAllTags } from '@/lib/blog'
import BlogCard from '@/components/BlogCard'

export default async function Blog() {
  const posts = await getAllPosts()
  const tags = getAllTags()

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stories, tips, and insights from my journey as a photographer. 
            Join me as I share what I&apos;ve learned behind the lens.
          </p>
        </div>

        {/* Featured Tags */}
        {tags.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Topic</h2>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="glass-effect px-4 py-2 rounded-full text-sm hover:bg-white/20 transition-all cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="glass-effect p-8 rounded-2xl max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-4">No Posts Yet</h3>
                <p className="text-gray-400">
                  I&apos;m working on some amazing content. Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20 text-center">
          <div className="glass-effect p-8 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-6">
              Get notified when I publish new stories and photography tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-blue-400"
              />
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}