"use client"

import { usePreferences } from "@/hooks/usePreferences"
import { NotificationPreferences } from "@/components/preferences/notification-preferences"
import { GeneralPreferences } from "@/components/preferences/general-preferences"
import { ThemeSelector } from "@/components/preferences/theme-selector"
import { TimezoneSelector } from "@/components/preferences/timezone-selector"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import type { NotificationSettings, PreferencesData } from "@/types/preferences"

export default function PreferencesPage() {
  const {
    preferences = {} as PreferencesData,
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

  return (
    <Card className="p-6">
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
              settings={preferences.email_notifications || {} as NotificationSettings}
              onChange={(key, value) => updatePreferences({
                email_notifications: { [key]: value }
              })}
              disabled={isUpdating}
            />

            <NotificationPreferences
              title="In-App Notifications"
              description="Configure which in-app notifications you'd like to receive"
              settings={preferences.in_app_notifications || {} as NotificationSettings}
              onChange={(key, value) => updatePreferences({
                in_app_notifications: { [key]: value }
              })}
              disabled={isUpdating}
            />
          </div>

          <GeneralPreferences
            preferences={preferences.preferences || {}}
            onChange={(key, value) => updatePreferences({
              preferences: { [key]: value }
            })}
            disabled={isUpdating}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <ThemeSelector
              theme={preferences.theme || 'light'}
              onChange={(theme) => updatePreferences({ theme })}
              disabled={isUpdating}
            />

            <TimezoneSelector
              timezone={preferences.timezone || 'UTC'}
              onChange={(timezone) => updatePreferences({ timezone })}
              disabled={isUpdating}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
