export interface DashboardOverview {
  totalEmails: EmailStats
  weeklyChange: {
    openRate: number
    clickRate: number
    bounceRate: number
    totalSent: number
  }
  dailyData: DailyEmailData[]
  bounceRateData: BounceRateData[]
}

export interface EmailStats {
  sent: number
  opened: number
  clicked: number
  bounced: number
}

export interface DailyEmailData {
  name: string
  sent: number
  opened: number
  clicked: number
}

export interface BounceRateData {
  name: string
  rate: number
}

export interface RecentActivity {
  id: number
  type: 'email_job' | 'template' | 'smtp' | 'api_key'
  title: string
  description: string
  status?: string
  created_at: string
}

export interface EmailJob {
  id: number
  subject: string
  recipient_count: number
  status: string
  success_count: number
  failure_count: number
  created_at: string
}

export interface Template {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  version: number
}

export interface SMTPConfig {
  id: number
  name: string
  host: string
  port: number
  username: string
  from_email: string
  is_default: boolean
  is_active: boolean
  created_at: string
}

export interface APIKey {
  id: number
  name: string
  created_at: string
  last_used_at: string | null
  expires_at: string | null
}
