"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format, formatDistanceToNow, isFuture } from "date-fns"
import { axiosInstance } from "@/lib/axios"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Star,
  Sparkles,
  Wrench,
  Shield,
  AlertTriangle,
  Code2,
  Component,
  Calendar,
  Clock,
  Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ChangelogEntry {
  id: number
  version: string
  release_date: string
  scheduled_for?: string
  type: 'major' | 'minor' | 'patch'
  changes: {
    type: 'feature' | 'improvement' | 'bugfix' | 'security' | 'deprecation'
    title: string
    description: string
    technical_details?: string
    affected_components?: string[]
  }[]
  is_published: boolean
  created_at: string
  updated_at: string
}

const changeTypeIcons = {
  feature: { icon: Star, color: 'text-green-500' },
  improvement: { icon: Sparkles, color: 'text-blue-500' },
  bugfix: { icon: Wrench, color: 'text-orange-500' },
  security: { icon: Shield, color: 'text-red-500' },
  deprecation: { icon: AlertTriangle, color: 'text-yellow-500' },
}

const changeTypeColors = {
  feature: 'bg-green-500/10 text-green-500 border-green-500/20',
  improvement: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  bugfix: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  security: 'bg-red-500/10 text-red-500 border-red-500/20',
  deprecation: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
}

const versionTypeColors = {
  major: 'bg-red-500/10 text-red-500 ring-red-500/30',
  minor: 'bg-blue-500/10 text-blue-500 ring-blue-500/30',
  patch: 'bg-green-500/10 text-green-500 ring-green-500/30',
}

export default function ChangelogPage() {
  const [filter, setFilter] = useState<string>("all")
  const [componentFilter, setComponentFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const perPage = 10

  const { data, isLoading } = useQuery({
    queryKey: ['changelog', filter, componentFilter, page],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        entries: ChangelogEntry[]
        pagination: { total: number; pages: number }
      }>('/api/v1/changelog', {
        params: {
          type: filter === 'all' ? undefined : filter,
          component: componentFilter === 'all' ? undefined : componentFilter,
          page,
          per_page: perPage,
        },
      })
      return response.data
    },
  })

  // Extract unique components for filtering
  const uniqueComponents = Array.from(
    new Set(
      data?.entries
        .flatMap(entry => entry.changes
          .flatMap(change => change.affected_components || []))
    )
  ).sort()

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
                Product Updates
              </h1>
              <p className="text-xl text-muted-foreground">
                Track our journey as we improve MailSage. See what&apos;s new, what&apos;s fixed, and what&apos;s coming.
              </p>
            </div>
          </div>
        </section>

        {/* Changelog Content */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Filters */}
            <div className="mb-8 flex flex-wrap gap-4 items-center justify-between bg-muted/50 p-4 rounded-lg">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={filter}
                    onValueChange={(value) => {
                      setFilter(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Changes</SelectItem>
                      <SelectItem value="feature">Features</SelectItem>
                      <SelectItem value="improvement">Improvements</SelectItem>
                      <SelectItem value="bugfix">Bug Fixes</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Component className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={componentFilter}
                    onValueChange={(value) => {
                      setComponentFilter(value)
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter by component" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Components</SelectItem>
                      {uniqueComponents.map(component => (
                        <SelectItem key={component} value={component}>
                          {component}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Changelog Entries */}
            <div className="space-y-16">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ))
              ) : (
                data?.entries.map((entry) => (
                  <div key={entry.id} className="relative pl-8 group">
                    {/* Version marker */}
                    <div className={cn(
                      "absolute -left-3 top-0 w-6 h-6 rounded-full bg-background",
                      "ring-2 ring-offset-2 ring-offset-background",
                      versionTypeColors[entry.type]
                    )} />

                    <div className="space-y-6">
                      {/* Version header */}
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-bold">v{entry.version}</h2>
                        <Badge variant="outline" className={versionTypeColors[entry.type]}>
                          {entry.type}
                        </Badge>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(entry.release_date), 'MMMM d, yyyy')}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              Released {formatDistanceToNow(new Date(entry.release_date))} ago
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {entry.scheduled_for && isFuture(new Date(entry.scheduled_for)) && (
                          <Badge variant="outline" className="bg-primary/5 text-primary">
                            <Clock className="mr-1 h-3 w-3" />
                            Scheduled for {format(new Date(entry.scheduled_for), 'MMM d')}
                          </Badge>
                        )}
                      </div>

                      {/* Changes */}
                      <div className="space-y-8">
                        {entry.changes.map((change, idx) => {
                          const TypeIcon = changeTypeIcons[change.type].icon
                          return (
                            <div key={idx} className="group/change">
                              <div className="flex items-start gap-4 group-hover/change:bg-muted/50 p-4 rounded-lg -mx-4 transition-colors">
                                <TypeIcon className={cn("h-6 w-6 mt-1", changeTypeIcons[change.type].color)} />

                                <div className="space-y-2 flex-grow">
                                  <div className="flex items-center gap-2">
                                    <Badge className={changeTypeColors[change.type]}>
                                      {change.type}
                                    </Badge>
                                    <h3 className="font-semibold">{change.title}</h3>
                                  </div>

                                  <p className="text-muted-foreground">{change.description}</p>

                                  {change.technical_details && (
                                    <div className="relative mt-4 group/tech">
                                      <div className="absolute -left-7 top-0 bottom-0 w-px bg-border group-hover/tech:bg-primary transition-colors" />
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                        <Code2 className="h-4 w-4" />
                                        Technical Details
                                      </div>
                                      <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                                        {change.technical_details}
                                      </pre>
                                    </div>
                                  )}

                                  {change.affected_components && (
                                    <div className="flex gap-2 mt-4">
                                      {change.affected_components.map((component) => (
                                        <Badge
                                          key={component}
                                          variant="outline"
                                          className="bg-background hover:bg-muted cursor-pointer"
                                          onClick={() => setComponentFilter(component)}
                                        >
                                          {component}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
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
      </main>
    </div>
  )
}
