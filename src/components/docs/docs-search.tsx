'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { useDocs } from '@/hooks/useDocs'
import { Command } from 'cmdk'
import { Search } from 'lucide-react'
import Link from 'next/link'
import type { SearchResult } from '@/types/docs'

export function DocsSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const { searchDocs } = useDocs()
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    async function performSearch() {
      if (debouncedQuery.length > 2) {
        try {
          const response = await searchDocs(debouncedQuery)
          setResults(response.results)
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        }
      } else {
        setResults([])
      }
    }

    void performSearch()
  }, [debouncedQuery, searchDocs])

  return (
    <Command className="relative">
      <div className="flex items-center border rounded-md px-3">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Command.Input
          value={query}
          onValueChange={setQuery}
          className="flex h-10 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Search documentation..."
        />
      </div>
      {results.length > 0 && (
        <Command.List className="absolute top-full mt-2 w-full rounded-md border bg-popover p-2 shadow-md z-50">
          {results.map((result) => (
            <Command.Item key={result.slug} className="px-2 py-1.5">
              <Link
                href={`/docs/${result.slug}`}
                className="block hover:bg-accent rounded-md p-2"
              >
                <div className="font-medium">{result.title}</div>
                <div className="text-sm text-muted-foreground">{result.excerpt}</div>
              </Link>
            </Command.Item>
          ))}
        </Command.List>
      )}
    </Command>
  )
}
