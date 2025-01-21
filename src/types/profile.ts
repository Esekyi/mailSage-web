export interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  bio: string | null;
  role: string;
  two_factor_enabled: boolean;
}

export interface NotificationCategory {
  quota_alerts: boolean;
  security_alerts: boolean;
  smtp_changes: boolean;
  system_updates: boolean;
  template_changes: boolean;
}

export interface NotificationSettings {
  email_notifications: NotificationCategory;
  in_app_notifications: NotificationCategory;
}

export interface ProfileResponse {
  profile: UserProfile;
preferences: Record<string, unknown>;
  notifications_settings: NotificationSettings;
}

export interface ProfileUpdateData {
  name: string;
  phone: string;
  company: string;
  job_title: string;
  bio: string;
}
