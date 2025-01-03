"use client"

import { useRouter } from 'next/navigation'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { User, CreditCard, Shield, Settings2 } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()

  const settingsSections = [
    {
      title: "Profile",
      description: "Manage your personal information and account details.",
      icon: User,
      href: "/dashboard/settings/profile"
    },
    {
      title: "Billing",
      description: "Manage your subscription and billing information.",
      icon: CreditCard,
      href: "/dashboard/settings/billing"
    },
    {
      title: "Preferences",
      description: "Customize your application settings, notifications, and preferences.",
      icon: Settings2,
      href: "/dashboard/settings/preferences"
    },
    {
      title: "Security",
      description: "Manage your password and security preferences.",
      icon: Shield,
      href: "/dashboard/settings/security"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => (
          <Card
            key={section.title}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => router.push(section.href)}
          >
            <CardHeader>
              <div className="flex items-center gap-2">
                <section.icon className="h-5 w-5" />
                <CardTitle className="text-base">{section.title}</CardTitle>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

