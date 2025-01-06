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
    // Function to extract headings and ensure unique IDs
    const extractHeadings = () => {
      const elements = document.querySelectorAll('.docs-content h2, .docs-content h3')
      let index = 0

      return Array.from(elements).map((element) => {
        // Generate unique ID if none exists
        const id = element.id || `heading-${index++}`
        if (!element.id) element.id = id

        return {
          id,
          level: Number(element.tagName.charAt(1)),
          text: element.textContent || `Heading ${index}`
        }
      }).filter(heading => heading.text.trim() !== '') // Filter out empty headings
    }

    // Initial extraction
    const items = extractHeadings()
    setHeadings(items)

    // Set up mutation observer to watch for content changes
    const observer = new MutationObserver(() => {
      const newItems = extractHeadings()
      setHeadings(newItems)
    })

    observer.observe(document.querySelector('.docs-content') || document.body, {
      childList: true,
      subtree: true
    })

    // Set up intersection observer for active heading
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            // Update URL hash without scrolling
            history.replaceState(null, '', `#${entry.target.id}`)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%' }
    )

    document.querySelectorAll('.docs-content h2, .docs-content h3').forEach((elem) => {
      intersectionObserver.observe(elem)
    })

    // Check for initial hash
    if (window.location.hash) {
      setActiveId(window.location.hash.slice(1))
    }

    return () => {
      observer.disconnect()
      intersectionObserver.disconnect()
    }
  }, [])

  if (headings.length === 0) return null

  return (
    <div className="sticky top-16">
      <h4 className="text-sm font-medium mb-4">On this page</h4>
      <ul className="space-y-2.5 text-sm">
        {headings.map((heading, index) => (
          <li key={`${heading.id}-${index}`}>
            <a
              href={`#${heading.id}`}
              className={cn(
                'text-muted-foreground hover:text-foreground transition-colors block',
                heading.level === 3 && 'pl-4',
                activeId === heading.id && 'text-foreground font-medium'
              )}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(heading.id)
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                  setActiveId(heading.id)
                  history.pushState(null, '', `#${heading.id}`)
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
