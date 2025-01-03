export interface Template {
  id: number
  name: string
  description: string | null
  html_content: string
  version: number
  is_active: boolean
  created_at: string
  updated_at: string
  required_variables: string[]
  version_info: {
    is_latest: boolean
    published_at: string | null
    change_summary: string | null
    created_by: number
    has_newer_version: boolean
  }
}

export interface UpdateTemplateData {
  name: string
  description?: string
  html_content: string
  change_summary?: string
}
