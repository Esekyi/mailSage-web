import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug
  const filePath = path.join(process.cwd(), 'docs', `${slug}.md`)

  try {
    const content = await fs.readFile(filePath, 'utf8')
    return NextResponse.json({ content })
  } catch (error) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }
}

