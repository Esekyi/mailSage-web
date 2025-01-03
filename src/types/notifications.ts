export interface Notification {
  id: number;
  title: string;
  message: string;
  category: 'template' | 'smtp' | 'system' | 'security';
  type: 'success' | 'error' | 'warning' | 'info';
  created_at: string;
  read_at: string | null;
  meta_data?: Record<string, any>;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    total: number;
  };
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface MarkAsReadResponse {
  message: string;
  unread_count: number;
}
