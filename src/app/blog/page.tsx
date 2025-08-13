import { getAllPosts, getAllTags } from '@/lib/blog'
import BlogPageClient from '@/components/BlogPageClient'

export default async function Blog() {
  const posts = await getAllPosts()
  const tags = getAllTags()

  return <BlogPageClient posts={posts} tags={tags} />
}