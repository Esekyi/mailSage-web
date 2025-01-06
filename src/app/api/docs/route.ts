import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

interface DocItem {
  slug: string
  title: string
  description?: string
  category: string
  order: number
}

export async function GET() {
  const docsDirectory = path.join(process.cwd(), 'docs')
  const files = await fs.readdir(docsDirectory)

  const documents = await Promise.all(
    files
      .filter(file => file.endsWith('.md'))
      .map(async file => {
        const content = await fs.readFile(path.join(docsDirectory, file), 'utf8')
        const { data } = matter(content)

        return {
          slug: file.replace('.md', ''),
          title: data.title || file.replace('.md', ''),
          description: data.description,
          category: data.category || 'General',
          order: data.order || 0
        } as DocItem
      })
  )

  // Group by category and sort
  const categories = documents.reduce((acc, doc) => {
    const category = doc.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(doc)
    return acc
  }, {} as Record<string, DocItem[]>)

  // Sort documents within each category
  Object.keys(categories).forEach(category => {
    categories[category].sort((a, b) => a.order - b.order)
  })

  // Convert to sections format
  const sections = Object.entries(categories).map(([title, items]) => ({
    title,
    items
  }))

  // Sort sections by first item's order in each section
  sections.sort((a, b) => {
    const aOrder = a.items[0]?.order || 0
    const bOrder = b.items[0]?.order || 0
    return aOrder - bOrder
  })

  return NextResponse.json({ sections })
}
