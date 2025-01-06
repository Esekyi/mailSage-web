export interface DocMeta {
  title: string
  category: string
  order: number
  [key: string]: string | number
}

export interface DocItem {
  slug: string
  title: string
  description?: string
  order: number
}

export interface DocSection {
  title: string
  items: DocItem[]
}

export interface DocCategory {
  sections: DocSection[]
}

export interface DocDetail {
  slug: string
  title: string
  category: string
  content: string
  toc: string
  meta: DocMeta
}

export interface SearchResult {
  slug: string
  title: string
  category: string
  excerpt: string
}

export interface SearchResponse {
  results: SearchResult[]
  count: number
}
