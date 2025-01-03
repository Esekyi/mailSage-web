export interface NotificationSettings {
  email_notifications: boolean;
  in_app_notifications: boolean;
}

export interface User {
  id: number;
  email: string;
  role: string;
  name: string;
  email_verified: boolean;
  notifications_settings: NotificationSettings;
}

export interface LoginResponse {
  data: {
    access_token: string
    refresh_token: string
    token_type: string
    user: User
  }
  message: string
}

export interface RegisterResponse {
  data: {
    user: User
  }
  message: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}
