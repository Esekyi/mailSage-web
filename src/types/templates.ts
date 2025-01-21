export interface VersionInfo {
  current_version: number
  has_versions: boolean
  is_initial_version?: boolean
  last_updated?: string
  latest_version?: number
  published_at: string | null
  versions_available: number
  versions_count: number
}

export interface MetaData {
  change_summary?: string
  previous_version?: number
  created_at?: string
  initial_version?: boolean
}

export interface Template {
  id: number
  name: string
  description: string
  html_content: string
  category: string | null
  created_at: string
  created_by: number | null
  deleted_at: string | null
  deleted_by: number | null
  is_active: boolean
  meta_data: MetaData
  published_at: string | null
  required_variables: string[]
  tags: string[]
  updated_at: string
  updated_by: number | null
  user_id: number
  version: number
  version_info: VersionInfo
}

export interface PaginationInfo {
  current_page: number
  has_next: boolean
  has_prev: boolean
  pages: number
  per_page: number
  total: number
}

export interface TemplateListResponse {
  pagination: PaginationInfo
  templates: Template[]
}

export interface CreateTemplatePayload {
  name: string
  description: string
  html_content: string
  category?: string | null
  tags?: string[]
}

export interface UpdateTemplatePayload extends Partial<CreateTemplatePayload> {
  meta_data?: {
    change_summary?: string
  }
}

export type TemplateDiffValue = string | number | boolean | null | string[] | Record<string, unknown>

export interface TemplateDifference {
  field: string
  old_value: TemplateDiffValue
  new_value: TemplateDiffValue
}

export interface VersionDetails {
  created_at: string
  html_content: string
  meta_data: {
    archived_at?: string
    description?: string
    name?: string
    change_summary?: string | null
    created_at?: string
    initial_version?: boolean
    previous_version?: number
  }
  version: number
}

export interface CompareVersionsResponse {
  current_version: number
  template_name: string
  version1: VersionDetails
  version2: VersionDetails
  differences?: TemplateDifference[]
}

export interface TemplateLimitError {
  error: string
  current_usage: number
  limit: number
  plan: string
  resource_type: string
}

export interface TemplateValidationError {
  error: string
}

export type TemplateApiError = TemplateLimitError | TemplateValidationError
