'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import Prism from 'prismjs'
import { DocHeader } from './doc-header'
import { DocError } from './doc-error'

// Load Prism languages
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'

interface DocContentProps {
  content?: string
  title: string
  description?: string
  category?: string
  editUrl?: string
  className?: string
  lastUpdated?: string
  error?: string
  notFound?: boolean
}

export function DocContent({
  content,
  title,
  description,
  category,
  editUrl,
  className = '',
  lastUpdated,
  error,
  notFound,
}: DocContentProps) {
  const { theme } = useTheme()
  const contentRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (contentRef.current && isClient && content) {
      // Add copy buttons to code blocks
      const codeBlocks = contentRef.current.querySelectorAll('pre')
      codeBlocks.forEach((block) => {
        // Skip if it's not a code block or already has a button
        if (!block.querySelector('code') || block.querySelector('.copy-button')) {
          return
        }

        // Add language class if not present
        const code = block.querySelector('code')
        if (code && !code.className.includes('language-')) {
          code.className = 'language-plaintext'
        }

        // Create and add copy button
        const copyButton = document.createElement('button')
        copyButton.className = 'copy-button'
        copyButton.setAttribute('type', 'button')
        copyButton.setAttribute('aria-label', 'Copy code')
        copyButton.innerHTML = 'Copy'

        copyButton.addEventListener('click', async () => {
          const code = block.querySelector('code')?.textContent || ''
          try {
            await navigator.clipboard.writeText(code.trim())
            copyButton.innerHTML = 'Copied!'
            setTimeout(() => {
              copyButton.innerHTML = 'Copy'
            }, 2000)
          } catch (err) {
            console.error('Failed to copy:', err)
            copyButton.innerHTML = 'Failed to copy'
            setTimeout(() => {
              copyButton.innerHTML = 'Copy'
            }, 2000)
          }
        })

        block.appendChild(copyButton)
      })

      // Highlight code
      Prism.highlightAllUnder(contentRef.current)
    }
  }, [content, isClient])

  // Handle error states
  if (notFound) {
    return <DocError type="404" />
  }

  if (error) {
    return <DocError type="error" />
  }

  // Only render content on client to avoid hydration mismatch
  if (!isClient) {
    return <div className={className} />
  }

  return (
    <div className={className}>
      <DocHeader
        title={title}
        description={description}
        category={category}
        editUrl={editUrl}
      />
      <div
        ref={contentRef}
        className={`markdown-body ${theme === 'dark' ? 'dark' : ''}`}
        data-theme={theme}
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />
      {lastUpdated && (
        <div className="mt-8 pt-4 border-t text-sm text-muted-foreground">
          Last updated on {new Date(lastUpdated).toLocaleDateString()}
        </div>
      )}
    </div>
  )
}
