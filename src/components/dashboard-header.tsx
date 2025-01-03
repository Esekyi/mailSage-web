"use client"

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Bell } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useNotifications } from '@/hooks/useNotifications'
import { Badge } from '@/components/ui/badge'

const Image = dynamic(() => import('next/image'), {ssr: false})

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="bg-muted"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </div>
    </header>
  )
}

