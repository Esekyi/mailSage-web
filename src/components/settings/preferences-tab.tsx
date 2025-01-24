import { usePreferences } from '@/hooks/usePreferences'
import { useThemePreference } from '@/hooks/useThemePreference'
import { NotificationPreferences } from '@/components/preferences/notification-preferences'
import { GeneralPreferences } from '@/components/preferences/general-preferences'
import { ThemeSelector } from '@/components/preferences/theme-selector'
import { TimezoneSelector } from '@/components/preferences/timezone-selector'
import { NotificationSettings } from '@/types/preferences'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'

export function PreferencesTab() {
  const {
    preferences,
    isLoading: isPreferencesLoading,
    updatePreferences,
    isUpdating
  } = usePreferences()

  const {
    theme,
    setTheme,
  } = useThemePreference()

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setSystemTheme(window?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    if (!isPreferencesLoading && preferences?.theme && theme !== preferences.theme) {
      setTheme(preferences.theme)
    }
  }, [isPreferencesLoading, preferences?.theme, setTheme, theme])

  if (isPreferencesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    // This will update both the UI and save to database
    setTheme(newTheme)
  }

  const handleEmailNotificationsChange = (key: keyof NotificationSettings, value: boolean) => {
    updatePreferences({
      email_notifications: {
        [key]: value
      }
    })
  }

  const handleInAppNotificationsChange = (key: keyof NotificationSettings, value: boolean) => {
    updatePreferences({
      in_app_notifications: {
        [key]: value
      }
    })
  }

  const handlePreferencesChange = (key: keyof typeof preferences.preferences, value: boolean) => {
    updatePreferences({
      preferences: {
        [key]: value
      }
    })
  }

  const handleTimezoneChange = (timezone: string) => {
    updatePreferences({ timezone })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Manage your notification preferences and application settings
        </p>
      </div>

      <Separator />

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <ThemeSelector
            theme={theme === 'system' ? systemTheme : theme as 'light' | 'dark'}
            onChange={handleThemeChange}
            disabled={isUpdating || isPreferencesLoading}
            // description="Choose your default theme preference. This will be saved to your account."
          />

          <TimezoneSelector
            timezone={preferences.timezone}
            onChange={handleTimezoneChange}
            disabled={isUpdating}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <NotificationPreferences
            title="Email Notifications"
            description="Configure which email notifications you'd like to receive"
            settings={preferences.email_notifications}
            onChange={handleEmailNotificationsChange}
            disabled={isUpdating}
          />

          <NotificationPreferences
            title="In-App Notifications"
            description="Configure which in-app notifications you'd like to receive"
            settings={preferences.in_app_notifications}
            onChange={handleInAppNotificationsChange}
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
