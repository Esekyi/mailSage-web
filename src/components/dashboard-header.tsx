"use client"

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useNotifications } from '@/hooks/useNotifications'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const Image = dynamic(() => import('next/image'), {ssr: false})

export function DashboardHeader() {
  const { theme } = useTheme()
  const { unreadCount } = useNotifications()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="md:hidden w-14" />
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Image
            src={theme === 'dark' ? '/navbarLogo-light.svg' : '/navbarLogo-dark.svg'}
            alt="mailSage Logo"
            width={32}
            height={32}
          />
          <span className="font-semibold gradient-text">mailSage</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-4">
          <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Docs
          </Link>
          <Link href="/dashboard/notifications" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
          <ThemeToggle className="bg-muted" permanent={true} />
        </nav>
      </div>
    </header>
  )
}
