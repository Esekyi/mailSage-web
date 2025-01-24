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
import {
  Clock,
  Search,
  Calendar,
  User,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

export default function BlogPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [page, setPage] = useState(1)
  const perPage = 9

  const { data, isLoading } = useQuery({
    queryKey: ['blog-posts', search, category, page],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        posts: BlogPost[]
        pagination: { total: number; pages: number }
        categories: { id: number; name: string; slug: string; count: number }[]
        featured_posts: BlogPost[]
      }>('/api/v1/blog/posts', {
        params: {
          search,
          category: category === 'all' ? undefined : category,
          page,
          per_page: perPage,
        },
      })
      return response.data
    },
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden border-b">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 blur-[100px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-text">
                Blog & Resources
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Insights, updates, and guides for building better email infrastructure.
              </p>
              <div className="flex items-center gap-4 max-w-lg mx-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="w-[180px]">
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
          </div>
        </section>

        {/* Featured Posts */}
        {data?.featured_posts && data.featured_posts.length > 0 && (
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
              <div className="grid lg:grid-cols-2 gap-8">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 p-6 w-full">
                      <div className="flex gap-2 mb-3">
                        {post.categories.map((cat) => (
                          <Badge key={cat.id} variant="secondary">
                            {cat.name}
                          </Badge>
                        ))}
                      </div>
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {post.author.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {post.reading_time} min read
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(post.published_at), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                // Loading skeletons
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
                    className="group flex flex-col rounded-xl border bg-card hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="aspect-[16/9] relative">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex-grow">
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
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {post.reading_time} min read
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(post.published_at), 'MMM d, yyyy')}
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
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get the latest articles and updates delivered to your inbox.
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-grow"
              />
              <Button className="gradient-bg">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
