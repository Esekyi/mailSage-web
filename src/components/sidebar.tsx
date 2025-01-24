"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Mail, Key, Settings, Menu, X, Server, LogOut, CreditCard, User, Sun, Moon, Trash2, ChevronRight, BarChart3, History } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/auth'
import { useThemePreference } from "@/hooks/useThemePreference"
import { Badge } from '@/components/ui/badge'
import type { JobAnalytics } from '@/types/jobs'
import { useJobAnalytics } from '@/hooks/useJobs'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface JobSubItem {
  name: string
  href: string
  badgeKey: keyof JobAnalytics['delivery_stats']
}

interface JobItem {
  name: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  items?: JobSubItem[]
  badgeKey?: keyof JobAnalytics['delivery_stats']
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Templates', href: '/dashboard/templates', icon: Mail },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
  { name: 'SMTP', href: '/dashboard/smtp', icon: Server },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Deleted Items', href: '/dashboard/settings/deleted-items', icon: Trash2 },
]

const jobItems: JobItem[] = [
  {
    name: 'Overview',
    href: '/dashboard/jobs',
    icon: BarChart3,
    badgeKey: 'total' // Shows total active jobs
  },
  {
    name: 'Job History',
    icon: History,
    iconColor: 'text-blue-500',
    items: [
      { name: 'All Jobs', href: '/dashboard/jobs/history', badgeKey: 'total' },
      { name: 'Completed', href: '/dashboard/jobs/history/completed', badgeKey: 'success_rate' },
      { name: 'Failed', href: '/dashboard/jobs/history/failed', badgeKey: 'success_rate' },
      { name: 'Stopped', href: '/dashboard/jobs/history/stopped', badgeKey: 'total' },
      { name: 'Paused', href: '/dashboard/jobs/history/paused', badgeKey: 'total' }
    ]
  }
]

const getBadgeCount = (analytics: JobAnalytics | undefined, key: keyof JobAnalytics['delivery_stats']) => {
  if (!analytics || !analytics.delivery_stats || typeof analytics.delivery_stats[key] !== 'number') return 0;
  return analytics.delivery_stats[key] as number;
};

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isJobsOpen, setIsJobsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useThemePreference()
  const { data: analytics } = useJobAnalytics(0) // Use a dummy ID to get overall analytics

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="md:hidden fixed top-3 left-3 z-50 h-8 w-8 p-0"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      <div className={cn(
        "fixed left-0 top-14 bottom-0 z-40 w-64 bg-background transition-transform duration-300 ease-in-out md:sticky md:top-14 overflow-y-auto flex flex-col h-[calc(100vh-3.5rem)]",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <nav className="flex-grow space-y-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}

          <div className="space-y-1">
            {jobItems.map((item) => (
              <div key={item.name}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", item.iconColor)} />
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                        pathname.startsWith('/dashboard/jobs')
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => setIsJobsOpen(!isJobsOpen)}
                    >
                      <item.icon className={cn("h-4 w-4", item.iconColor)} />
                      <span className="flex-1 text-left">{item.name}</span>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        isJobsOpen && "rotate-90"
                      )} />
                    </Button>

                    {isJobsOpen && item.items && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                              pathname === subItem.href
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            <span className="flex-1 text-left">{subItem.name}</span>
                            {analytics?.delivery_stats && getBadgeCount(analytics, subItem.badgeKey) > 0 && (
                              <Badge variant="secondary" className="ml-auto">
                                {getBadgeCount(analytics, subItem.badgeKey)}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
                  <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <span className="flex-1 text-left text-sm">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings/billing" className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                Toggle theme
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
