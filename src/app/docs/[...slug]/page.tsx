// pages/docs/[...slug].tsx
'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useDocs } from '@/hooks/useDocs'
import { Loader2 } from 'lucide-react'
import Prism from 'prismjs'

// Base languages - order matters!
import 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-markup-templating'

// Common languages
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-regex'
import 'prismjs/components/prism-http'

// Theme
import 'prismjs/themes/prism-okaidia.css'

// Initialize languages after all imports
if (typeof window !== 'undefined') {
  // Ensure we're in browser environment
  const languages = [
    'markup',
    'javascript',
    'typescript',
    'python',
    'bash',
    'json',
    'yaml',
    'markdown',
    'regex',
    'http'
  ]

  languages.forEach(lang => {
    if (Prism.languages[lang]) {
      // Create a fresh copy of the language definition
      const langDef = { ...Prism.languages[lang] }
      Prism.languages[lang] = langDef
    }
  })
}

export default function DocPage() {
  const params = useParams()
  const { useDocDetail } = useDocs()
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug || ''
  const { data: doc, isLoading, error } = useDocDetail(slug)

  useEffect(() => {
    if (doc) {
      const timer = setTimeout(() => {
        try {
          // Find all code blocks
          document.querySelectorAll('pre[class*="language-"]').forEach((block) => {
            // Extract language from class (e.g., "language-python" -> "python")
            const language = Array.from(block.classList)
              .find(cls => cls.startsWith('language-'))
              ?.replace('language-', '') || 'text'

            // Set data-language attribute for the badge
            block.setAttribute('data-language', language)

            // Ensure the code element inside has the correct language class
            const codeElement = block.querySelector('code')
            if (codeElement) {
              // Remove any existing language classes
              codeElement.className = ''
              // Add the correct language class
              codeElement.classList.add(`language-${language}`)

              // Force Prism to highlight this element
              if (language && Prism.languages[language]) {
                const code = codeElement.textContent || ''
                codeElement.innerHTML = Prism.highlight(
                  code,
                  Prism.languages[language],
                  language
                )
              } else {
                // Fallback to plain text if language not supported
                codeElement.classList.add('language-text')
              }
            }
          })
        } catch (err) {
          console.error('Error highlighting code:', err)
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [doc])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <h2 className="text-lg font-semibold">Error</h2>
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="text-center">
        <h2 className="text-lg font-semibold">Document not found</h2>
        <p className="text-muted-foreground">The requested document could not be found.</p>
      </div>
    )
  }

  return (
    <article className="docs-content prose prose-slate max-w-none dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: doc.content }} />
    </article>
  )
}
