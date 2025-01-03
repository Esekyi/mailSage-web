import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Shield, AlertTriangle, CheckCircle, Mail, Server, Activity } from "lucide-react"
import type { NotificationSettings } from "@/types/preferences"

interface NotificationPreferencesProps {
  title: string;
  description: string;
  settings: NotificationSettings;
  onChange: (key: keyof NotificationSettings, value: boolean) => void;
  disabled?: boolean;
}

const notificationTypes = {
  system_updates: {
    label: "System Updates",
    icon: Server,
    description: "Get notified about system updates and maintenance"
  },
  security_alerts: {
    label: "Security Alerts",
    icon: Shield,
    description: "Important security-related notifications"
  },
  quota_alerts: {
    label: "Quota Alerts",
    icon: AlertTriangle,
    description: "Notifications about quota usage and limits"
  },
  template_changes: {
    label: "Template Changes",
    icon: Mail,
    description: "Updates about template modifications"
  },
  smtp_changes: {
    label: "SMTP Changes",
    icon: Activity,
    description: "Notifications about SMTP configuration changes"
  },
  delivery_status: {
    label: "Delivery Status",
    icon: CheckCircle,
    description: "Updates about email delivery status"
  }
} as const

export function NotificationPreferences({
  title,
  description,
  settings,
  onChange,
  disabled
}: NotificationPreferencesProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-4">
          {Object.entries(notificationTypes).map(([key, config]) => {
            const Icon = config.icon
            return (
              <div key={key} className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label htmlFor={key}>{config.label}</Label>
                    <p className="text-xs text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={key}
                  checked={settings[key as keyof NotificationSettings]}
                  onCheckedChange={(checked) =>
                    onChange(key as keyof NotificationSettings, checked)
                  }
                  disabled={disabled}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
