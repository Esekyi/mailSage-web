'use client'

interface DocHeaderProps {
  title: string
  description?: string
  editUrl?: string
  category?: string
}

export function DocHeader({ title, description, editUrl, category }: DocHeaderProps) {
  return (
    <div className="mb-8 border-b pb-4">
      {category && (
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {category}
        </p>
      )}
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-xl text-muted-foreground mt-2">
          {description}
        </p>
      )}
      {editUrl && (
        <a
          href={editUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mt-4"
        >
          Edit this page on GitHub
        </a>
      )}
    </div>
  )
}
