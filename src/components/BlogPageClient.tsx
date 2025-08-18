'use client'

import { BlogPostMetadata } from '@/lib/blog'
import BlogCard from '@/components/BlogCard'

interface BlogPageClientProps {
  posts: BlogPostMetadata[]
  tags: string[]
}

export default function BlogPageClient({ posts, tags }: BlogPageClientProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-center">Blog</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No posts yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}