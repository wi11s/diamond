import Link from 'next/link'
import Image from 'next/image'
import { BlogPostMetadata } from '@/lib/blog'

interface BlogCardProps {
  post: BlogPostMetadata
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="block border border-gray-200 p-4 hover:border-gray-400 transition-colors">
        {post.coverImage && (
          <div className="relative h-48 mb-4">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="text-sm text-gray-500 mb-2">
          {new Date(post.date).toLocaleDateString()}
        </div>
        
        <h2 className="text-xl font-medium mb-2 text-gray-900">
          {post.title}
        </h2>
        
        <p className="text-gray-600 mb-4 text-sm">
          {post.excerpt}
        </p>
        
        <div className="text-gray-700 text-sm">
          Read more →
        </div>
      </Link>
    </article>
  )
}