import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export async function GET() {
  const docsDirectory = path.join(process.cwd(), 'docs')
  const files = await fs.readdir(docsDirectory)

  const categories = new Set<string>()

  await Promise.all(
    files
      .filter(file => file.endsWith('.md'))
      .map(async file => {
        const content = await fs.readFile(path.join(docsDirectory, file), 'utf8')
        const { data } = matter(content)
        categories.add(data.category || 'General')
      })
  )

  return NextResponse.json({
    categories: Array.from(categories).sort()
  })
}
