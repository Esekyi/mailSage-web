import { usePreferences } from '@/hooks/usePreferences'
import { useThemePreference } from '@/hooks/useThemePreference'
import { NotificationPreferences } from '@/components/preferences/notification-preferences'
import { GeneralPreferences } from '@/components/preferences/general-preferences'
import { ThemeSelector } from '@/components/preferences/theme-selector'
import { TimezoneSelector } from '@/components/preferences/timezone-selector'
import type { NotificationSettings, PreferencesData } from '@/types/preferences'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export function PreferencesTab() {
  const {
    preferences = {
      timezone: 'UTC',
      email_notifications: {
        system_updates: false,
        security_alerts: false,
        quota_alerts: false,
        template_changes: false,
        smtp_changes: false,
        delivery_status: false
      },
      in_app_notifications: {
        system_updates: false,
        security_alerts: false,
        quota_alerts: false,
        template_changes: false,
        smtp_changes: false,
        delivery_status: false
      },
      preferences: {
        login_alerts: false,
        failed_attempt_alerts: false,
        two_factor_auth: false,
        quota_alerts: false,
        usage_reports: false,
        rate_limit_alerts: false,
        template_versioning: false,
        template_autosave: false,
        template_change_alerts: false,
        smtp_failure_alerts: false,
        smtp_performance_alerts: false,
        delivery_status_alerts: false,
        marketing_emails: false,
        product_updates: false,
        maintenance_alerts: false
      },
      theme: 'light' as const
    } satisfies PreferencesData,
    isLoading: isPreferencesLoading,
    updatePreferences,
    isUpdating
  } = usePreferences()

  const { theme, setTheme } = useThemePreference()
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light')
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean, type: 'email' | 'in_app') => {
    updatePreferences({
      [type === 'email' ? 'email_notifications' : 'in_app_notifications']: {
        [key]: value
      }
    })
  }

  const handlePreferencesChange = (key: keyof PreferencesData['preferences'], value: boolean) => {
    updatePreferences({
      preferences: {
        [key]: value
      }
    })
  }

  if (isPreferencesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account preferences and notification settings.
        </p>
      </div>

      <Separator />

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <ThemeSelector
            theme={theme === 'system' ? systemTheme : theme as 'light' | 'dark'}
            onChange={setTheme}
            disabled={isUpdating}
          />

          <TimezoneSelector
            timezone={preferences.timezone}
            onChange={(timezone: string) => updatePreferences({ timezone })}
            disabled={isUpdating}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <NotificationPreferences
            title="Email Notifications"
            description="Configure which email notifications you'd like to receive"
            settings={preferences.email_notifications}
            onChange={(key, value) => handleNotificationChange(key, value, 'email')}
            disabled={isUpdating}
          />

          <NotificationPreferences
            title="In-App Notifications"
            description="Configure which in-app notifications you'd like to receive"
            settings={preferences.in_app_notifications}
            onChange={(key, value) => handleNotificationChange(key, value, 'in_app')}
            disabled={isUpdating}
          />
        </div>

        <GeneralPreferences
          preferences={preferences.preferences}
          onChange={handlePreferencesChange}
          disabled={isUpdating}
        />
      </div>
    </div>
  )
}
