export interface SMTPConfig {
  id: number;
  name: string;
  host: string;
  port: number;
  username: string;
  from_email: string;
  use_tls: boolean;
  is_default: boolean;
  is_active: boolean;
  daily_limit: number;
  emails_sent_today: number;
  last_used_at: string | null;
  last_test_at: string | null;
  failure_count: number;
}

export interface CreateSMTPConfig {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  use_tls: boolean;
  from_email: string;
  is_default: boolean;
  daily_limit?: number;
}

export interface UpdateSMTPConfig extends CreateSMTPConfig {
  id: number;
}

export interface TestEmailResponse {
  message: string;
  details?: string;
  config: SMTPConfig;
  last_test: string;
  test_email_sent_to: string;
}

export interface SMTPResponse {
  message: string;
  config: SMTPConfig;
}

export interface SMTPListResponse {
  smtp_configurations: SMTPConfig[];
}
