import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react'
import { axiosInstance } from '@/lib/axios'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShareButtons } from '@/components/share-buttons'

interface BlogPost {
  id: number
  slug: string
  title: string
  content: string
  excerpt: string
  cover_image: string
  author: {
    name: string
    avatar: string
    bio: string
  }
  categories: Array<{ id: number, name: string, slug: string }>
  tags: Array<{ id: number, name: string, slug: string }>
  reading_time: number
  published_at: string
  meta: {
    title: string
    description: string
    keywords: string[]
  }
}

async function getBlogPost(slug: string): Promise<BlogPost> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/blog/posts/${slug}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  })

  if (!res.ok) {
    if (res.status === 404) {
      notFound()
    }
    throw new Error('Failed to fetch blog post')
  }

  return res.json()
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const { data } = await axiosInstance.get<BlogPost>(`/api/v1/blog/posts/${resolvedParams.slug}`)

    return {
      title: data.meta.title || data.title,
      description: data.meta.description || data.excerpt,
      openGraph: {
        title: data.meta.title || data.title,
        description: data.meta.description || data.excerpt,
        type: 'article',
        publishedTime: data.published_at,
        authors: [data.author.name],
        images: [data.cover_image],
        tags: data.tags.map(tag => tag.name),
      },
      twitter: {
        card: 'summary_large_image',
        title: data.meta.title || data.title,
        description: data.meta.description || data.excerpt,
      },
      keywords: data.meta.keywords,
    }
  } catch (error) {
    console.error('API Error:', error)
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params
  const post = await getBlogPost(resolvedParams.slug)

  return (
    <main className="container max-w-4xl mx-auto px-4 py-8">
      <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blog
      </Link>

      <article className="prose prose-slate dark:prose-invert max-w-none">
        <div className="relative w-full aspect-[2/1] mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(post.published_at), 'MMMM d, yyyy')}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.reading_time} min read
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              {post.categories.map(cat => cat.name).join(', ')}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>
                {post.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{post.author.bio}</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Separator className="my-8" />

        <div className="flex flex-wrap gap-2 my-8">
          {post.tags.map(tag => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>

        <ShareButtons
          url={`${process.env.NEXT_PUBLIC_URL}/blog/${post.slug}`}
          title={post.title}
        />
      </article>
    </main>
  )
}
