"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TableOfContentsItem {
  id: string
  level: number
  text: string
}

export function DocsTableOfContents() {
  const [headings, setHeadings] = useState<TableOfContentsItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const getHeadings = () => {
      // Target the markdown-body class which contains the rendered content
      const elements = document.querySelectorAll('.markdown-body h2, .markdown-body h3')
      const items: TableOfContentsItem[] = []

      elements.forEach((element) => {
        // Ensure element is a heading element
        if (element instanceof HTMLHeadingElement) {
          // Generate ID if not present
          const id = element.id || element.textContent?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || `heading-${items.length}`

          // Set the ID on the element if it doesn't have one
          if (!element.id) {
            element.id = id
          }

          items.push({
            id,
            level: parseInt(element.tagName[1]),
            text: element.textContent || ''
          })
        }
      })

      setHeadings(items)
    }

    // Initial load
    getHeadings()

    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0% -66%',
        threshold: 1
      }
    )

    // Observe all headings
    document.querySelectorAll('.markdown-body h2, .markdown-body h3').forEach((heading) => {
      observer.observe(heading)
    })

    // Cleanup
    return () => {
      observer.disconnect()
    }
  }, [])

  if (headings.length === 0) return null

  return (
    <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <h4 className="font-medium text-sm mb-4">On this page</h4>
      <div className="space-y-2">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              'block text-sm transition-colors hover:text-foreground',
              heading.level === 3 && 'pl-4',
              activeId === heading.id
                ? 'text-foreground font-medium'
                : 'text-muted-foreground'
            )}
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById(heading.id)
              if (element) {
                // Add offset for fixed header
                const offset = 100 // Adjust this value based on your header height
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                window.scrollTo({
                  top: elementPosition - offset,
                  behavior: 'smooth'
                })
                setActiveId(heading.id)
                history.pushState(null, '', `#${heading.id}`)
              }
            }}
          >
            {heading.text}
          </a>
        ))}
      </div>
    </div>
  )
}
