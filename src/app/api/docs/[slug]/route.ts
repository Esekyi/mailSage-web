import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const docPath = path.join(process.cwd(), 'docs', `${params.slug}.md`)
    const content = await fs.readFile(docPath, 'utf8')
    const { data, content: markdown } = matter(content)

    // Convert markdown to HTML
    const html = marked(markdown)

    // Generate table of contents
    const toc = generateToc(markdown)

    return NextResponse.json({
      slug: params.slug,
      title: data.title,
      category: data.category,
      content: html,
      toc,
      meta: data
    })
} catch (_error) {
    return NextResponse.json(
      { error: 'Document not found' },
      { status: 404 }
    )
  }
}

function generateToc(markdown: string): string {
  const headings = markdown.match(/^#{2,3}\s+.+$/gm) || []
  if (headings.length === 0) return ''

  return headings
    .map(heading => {
      const level = heading.match(/^(#{2,3})\s/)?.[1].length || 2
      const text = heading.replace(/^#{2,3}\s+/, '')
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const indent = level === 3 ? 'ml-4' : ''
      return `<a href="#${id}" class="block hover:text-primary ${indent}">${text}</a>`
    })
    .join('\n')
}
