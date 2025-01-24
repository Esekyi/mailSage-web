export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'paused' | 'stopped'

export type JobAction = 'pause' | 'resume' | 'stop' | 'retry'

export interface JobProgress {
  total: number
  sent: number
  failed: number
  pending: number
  percentage: number
}

export interface Job {
  id: number
  status: JobStatus
  tracking_id: string
  progress: JobProgress
  is_paused: boolean
  created_at: string
  started_at: string | null
  completed_at: string | null
  error_details?: string
  template_id?: number
  campaign_id?: number
  smtp_config_id?: number
  processing_time?: number
  meta_data?: {
    is_templated: boolean
    smtp_strategy: string
    paused_at: string | null
    pause_reason: string | null
    resumed_at: string | null
  }
}

export interface JobsResponse {
  jobs: Job[]
  pagination: {
    total: number
    pages: number
    current_page: number
    per_page: number
  }
}

export interface BulkJobAction {
  job_ids: number[]
  action: JobAction
}

export interface RetryJobConfig {
  max_retries?: number
}

export interface JobAnalytics {
  job_info: {
    id: number
    status: JobStatus
    created_at: string
    started_at: string | null
    completed_at: string | null
    processing_time?: number
  }
  delivery_stats: {
    by_status: Array<{
      status: string
      count: number
      percentage: number
      avg_attempts: number
    }>
    success_rate: number
    total: number
  }
  error_analysis: {
    patterns: Array<{
      error: string
      count: number
      percentage: number
    }>
  }
  performance_metrics: {
    average_delivery_time?: number
    delivery_rate: number
    failure_rate: number
  }
}
