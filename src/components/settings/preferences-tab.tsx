import { usePreferences } from "@/hooks/usePreferences"
import { NotificationPreferences } from "@/components/preferences/notification-preferences"
import { GeneralPreferences } from "@/components/preferences/general-preferences"
import { ThemeSelector } from "@/components/preferences/theme-selector"
import { TimezoneSelector } from "@/components/preferences/timezone-selector"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import type { NotificationSettings } from "@/types/preferences"

export function PreferencesTab() {
  const {
    preferences,
    isLoading,
    updatePreferences,
    isUpdating
  } = usePreferences()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
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

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updatePreferences({ theme })
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

        <div className="grid gap-4 md:grid-cols-2">
          <ThemeSelector
            theme={preferences.theme}
            onChange={handleThemeChange}
            disabled={isUpdating}
          />

          <TimezoneSelector
            timezone={preferences.timezone}
            onChange={handleTimezoneChange}
            disabled={isUpdating}
          />
        </div>
      </div>
    </div>
  )
}
