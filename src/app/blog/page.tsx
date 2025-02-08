"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { axiosInstance } from "@/lib/axios"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { NewsletterSignup } from '@/components/newsletter-signup'
import {
  Clock,
  Search,
  Calendar,
  Tag as TagIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image: string
  author: {
    id: number
    name: string
    avatar: string
    role: string
  }
  categories: {
    id: number
    name: string
    slug: string
  }[]
  tags: {
    id: number
    name: string
    slug: string
  }[]
  reading_time: number
  published_at: string
  featured: boolean
  meta: {
    title: string
    description: string
    keywords: string[]
  }
}

interface BlogResponse {
  posts: BlogPost[]
  featured_posts: BlogPost[]
  categories: {
    id: number
    name: string
    slug: string
    count: number
  }[]
  pagination: {
    current_page: number
    pages: number
    per_page: number
    total: number
  }
}

export default function BlogPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery<BlogResponse>({
    queryKey: ['blog-posts', search, category, page],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/v1/blog/posts', {
        params: {
          search,
          category: category === 'all' ? undefined : category,
          page,
          per_page: 9
        }
      })
      return response.data
    }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden border-b">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 blur-[100px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-text">
                Latest Updates & Insights
              </h1>
              <p className="text-xl text-muted-foreground">
                Stay informed about email infrastructure, deliverability best practices, and product updates.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {data?.featured_posts && data.featured_posts.length > 0 && (
          <section className="py-12 px-4">
            <div className="container mx-auto">
              <h2 className="text-2xl font-bold mb-8">Featured Stories</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {data.featured_posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all"
                  >
                    <div className="aspect-[16/9] relative">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 p-6 text-white">
                        <div className="flex gap-2 mb-3">
                          {post.categories.map((cat) => (
                            <Badge key={cat.id} variant="secondary" className="bg-white/20 hover:bg-white/30">
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                        <p className="line-clamp-2 text-white/80">{post.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blog Content */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            {/* Filters */}
            <div className="mb-8 flex flex-wrap gap-4 items-center justify-between bg-muted/50 p-4 rounded-lg">
              <div className="flex gap-4 flex-grow md:flex-grow-0">
                <div className="relative flex-grow md:w-64 md:flex-grow-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <TagIcon className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {data?.categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name} ({cat.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : (
                data?.posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all h-full"
                  >
                    <div className="aspect-[16/9] relative">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex gap-2 mb-3">
                        {post.categories.map((cat) => (
                          <Badge key={cat.id} variant="secondary">
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.reading_time}m
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(post.published_at), 'MMM d')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Pagination */}
            {data?.pagination && data.pagination.pages > 1 && (
              <div className="mt-16 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                  disabled={page === data.pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-muted/10 via-muted/30 to-muted/10">
          <div className="container mx-auto max-w-4xl relative">
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 blur-[100px]" />
            </div>

            <div className="bg-card border rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Stay in the Loop
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Get the latest updates on email infrastructure, best practices, and product news delivered straight to your inbox.
                </p>
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
