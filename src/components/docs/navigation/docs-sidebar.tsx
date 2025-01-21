'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDocs } from "@/hooks/useDocs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Loader2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

export function DocsSidebar() {
  const pathname = usePathname()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)
  const { docs, isLoading, error } = useDocs()

  const filteredDocs = docs?.sections?.flatMap(section =>
    section.items.filter(item =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  ) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px] text-destructive">
        Error loading documentation
      </div>
    )
  }

  if (!docs?.sections?.length) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No documentation available
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <div className="space-y-4 px-4 md:px-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            className="pl-8 h-9 w-[calc(100%-8px)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[calc(100vh-10rem)] pr-6">
          {debouncedSearch ? (
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Search Results</h4>
              {filteredDocs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No results found for &quot;{debouncedSearch}&quot;
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredDocs.map((doc) => (
                    <Link
                      key={doc.slug}
                      href={`/docs/${doc.slug}`}
                      className={cn(
                        "group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                        pathname === `/docs/${doc.slug}`
                          ? "bg-accent font-medium text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <ChevronRight className={cn(
                        "h-4 w-4 shrink-0 transition-transform",
                        pathname === `/docs/${doc.slug}` ? "text-foreground" : "text-muted-foreground/50",
                        "group-hover:text-foreground"
                      )} />
                      {doc.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {docs.sections.map((section) => (
                <div key={section.title} className="space-y-2">
                  <h4 className="font-medium text-sm px-3 text-foreground/70">{section.title}</h4>
                  <div className="grid gap-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/docs/${item.slug}`}
                        className={cn(
                          "group flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all duration-200 ease-in-out hover:bg-accent",
                          pathname === `/docs/${item.slug}`
                            ? "bg-accent font-medium text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <ChevronRight className={cn(
                          "h-4 w-4 shrink-0 transition-transform",
                          pathname === `/docs/${item.slug}` ? "text-foreground rotate-90" : "text-muted-foreground/50",
                          "group-hover:text-foreground group-hover:rotate-90"
                        )} />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
