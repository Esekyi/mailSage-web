export type APIKeyType = 'test' | 'live'

export type APIKeyPermission = 'send_email' | 'manage_templates' | 'manage_smtp' | 'view_analytics' | 'webhook_management'

export interface APIKey {
  id: number;
  name: string;
  key_prefix: string;
  key_type: 'test' | 'live';
  permissions: APIKeyPermission[];
  created_at: string;
  expires_at: string | null;
  last_used_at: string | null;
  daily_requests: number;
}

export interface CreateAPIKeyRequest {
  name: string;
  key_type: APIKeyType;
  permissions: APIKeyPermission[];
  expires_in_days?: number | null;
}

export interface CreateAPIKeyResponse {
  api_key: APIKey
  key: string
}

export interface APIKeysListResponse {
  api_keys: APIKey[];
}

export interface ApiKeyUsageStats {
  total_requests: number;
  success_requests: number;
  error_requests: number;
  success_rate: number;
  current_daily_requests: number;
  daily_average: number;
  days_analyzed: number;
  last_used_at: string | null;
  endpoint_usage: Record<string, number>;
  daily_limit: number;
  daily_remaining: number;
}

export interface ApiKeyUsageResponse {
  usage_stats: ApiKeyUsageStats;
}

export interface RevokeAPIKeyResponse {
  message: string;
}

// Constants for permissions and expiry options
export const API_KEY_PERMISSIONS = [
  { value: 'full_access', label: 'Full Access' },
  { value: 'send_email', label: 'Send Email' },
  { value: 'manage_templates', label: 'Manage Templates' },
  { value: 'manage_smtp', label: 'Manage SMTP' },
  { value: 'view_analytics', label: 'View Analytics' },
  { value: 'webhook_management', label: 'Manage Webhooks' },
] as const;

export const ALL_PERMISSIONS: APIKeyPermission[] = [
  'send_email',
  'manage_templates',
  'manage_smtp',
  'view_analytics',
  'webhook_management',
];

export const API_KEY_EXPIRY_OPTIONS = [
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
  { value: 180, label: '180 days' },
  { value: 365, label: '1 year' },
  { value: 730, label: '2 years' },
  { value: 1095, label: '3 years' },
  { value: 0, label: 'Never' },
] as const;
