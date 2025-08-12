import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Tag, ArrowLeft } from 'lucide-react'
import { getPostBySlug, getAllPosts } from '@/lib/blog'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{post.readTime}</span>
            </div>
            <span>by {post.author}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 glass-effect rounded-full text-sm"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-64 md:h-96 mb-8 rounded-2xl overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div className="glass-effect p-8 rounded-2xl">
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-gradient prose-headings:font-bold
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white prose-strong:font-semibold
              prose-code:bg-white/10 prose-code:text-blue-300 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-white/5 prose-blockquote:pl-6 prose-blockquote:italic
              prose-ul:text-gray-300 prose-ol:text-gray-300
              prose-li:marker:text-blue-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Author Info */}
        <div className="mt-12 glass-effect p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">TD</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{post.author}</h3>
              <p className="text-gray-400">
                Photographer, storyteller, and creative explorer. Sharing the world 
                one frame at a time.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="glass-effect p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">Enjoyed this post?</h3>
            <p className="text-gray-300 mb-6">
              Check out my photography work or get in touch for collaborations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/photos"
                className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                View Portfolio
              </Link>
              <Link
                href="/about"
                className="border border-white/30 px-6 py-3 rounded-lg hover:bg-white/10 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}