'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDocs } from "@/hooks/useDocs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"

export function DocsSidebar() {
  const pathname = usePathname()
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)
  const { docs, isLoading } = useDocs()

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

  return (
    <div className="relative h-full w-full">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            className="pl-8 h-9"
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
                        "block text-sm transition-colors hover:text-foreground",
                        pathname === `/docs/${doc.slug}`
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {doc.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {docs?.sections?.map((section) => (
                <div key={section.title} className="space-y-2">
                  <h4 className="font-medium text-sm">{section.title}</h4>
                  <div className="grid gap-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/docs/${item.slug}`}
                        className={cn(
                          "block text-sm transition-colors hover:text-foreground",
                          pathname === `/docs/${item.slug}`
                            ? "font-medium text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
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
