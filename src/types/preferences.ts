export interface NotificationSettings {
  system_updates: boolean;
  security_alerts: boolean;
  quota_alerts: boolean;
  template_changes: boolean;
  smtp_changes: boolean;
  delivery_status: boolean;
}

export interface UserPreferences {
  // security
  login_alerts: boolean;
  failed_attempt_alerts: boolean;
  two_factor_auth: boolean;

  // Usage
  quota_alerts: boolean;
  usage_reports: boolean;
  rate_limit_alerts: boolean;

  // Templates
  template_versioning: boolean;
  template_autosave: boolean;
  template_change_alerts: boolean;

  // SMTP
  smtp_failure_alerts: boolean;
  smtp_performance_alerts: boolean;
  delivery_status_alerts: boolean;

  // Marketing
  marketing_emails: boolean;
  product_updates: boolean;
  maintenance_alerts: boolean;
}

export interface PreferencesData {
  email_notifications: NotificationSettings;
  in_app_notifications: NotificationSettings;
  preferences: UserPreferences;
  timezone: string;
  theme: 'light' | 'dark';
}

export interface UpdatePreferencesRequest {
  email_notifications?: Partial<NotificationSettings>;
  in_app_notifications?: Partial<NotificationSettings>;
  preferences?: Partial<UserPreferences>;
  timezone?: string;
  theme?: 'light' | 'dark';
}

export interface UpdatePreferencesResponse {
  message: string;
  preferences: PreferencesData;
}
