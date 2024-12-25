'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { fetchApi } from '@/lib/api-config'

interface Document {
  id: number
  title: string
  slug: string
  content: string
  category: string
  order: number
  metadata: Record<string, any>
}

export default function DocsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchDocuments()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetchApi('/api/v1/docs/categories')
      setCategories(response.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('q', searchQuery)
      if (selectedCategory) params.append('category', selectedCategory)

      const response = await fetchApi(`/api/v1/docs?${params}`)
      setDocuments(response.documents)
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      fetchDocuments()
    }, 300)

    return () => clearTimeout(debounceSearch)
  }, [searchQuery, selectedCategory])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Documentation</h1>
        <div className="flex gap-4 mb-4">
          <Input
            type="search"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2">{doc.title}</h2>
              <div className="prose max-w-none">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {doc.content}
                </ReactMarkdown>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Category: {doc.category}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}