"use client"

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Menu } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useAuthStore } from '@/store/auth'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// Use dynamic import for Image to avoid hydration issues
const Image = dynamic(() => import('next/image'), {
  ssr: false,
  loading: () => <div className="w-8 h-8 bg-muted rounded-sm" />
})

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { isAuthenticated } = useAuthStore()

  const navigationItems = isAuthenticated ? (
    <>
      <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Features
      </Link>
      <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Pricing
      </Link>
      <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Docs
      </Link>
      <Link href="/dashboard">
        <Button variant="ghost" size="sm">Dashboard</Button>
      </Link>
      <Link href="/dashboard/settings">
        <Button size="sm">Account</Button>
      </Link>
    </>
  ) : (
    <>
      <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Features
      </Link>
      <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Pricing
      </Link>
      <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Docs
      </Link>
      <Link href="/login">
        <Button variant="ghost" size="sm">Log in</Button>
      </Link>
      <Link href="/register">
        <Button size="sm">Sign up</Button>
      </Link>
    </>
  )

  const mobileNavigationItems = isAuthenticated ? (
    <>
      <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Features
      </Link>
      <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Pricing
      </Link>
      <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Docs
      </Link>
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="w-full justify-start">Dashboard</Button>
      </Link>
      <Link href="/dashboard/settings">
        <Button size="sm" className="w-full">Account</Button>
      </Link>
    </>
  ) : (
    <>
      <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Features
      </Link>
      <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Pricing
      </Link>
      <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground">
        Docs
      </Link>
      <Link href="/login">
        <Button variant="ghost" size="sm" className="w-full justify-start">Log in</Button>
      </Link>
      <Link href="/register">
        <Button size="sm" className="w-full">Sign up</Button>
      </Link>
    </>
  )

  return (
    <header className={cn("bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={theme === 'dark' ? '/navbarLogo-light.svg' : '/navbarLogo-dark.svg'}
            alt="MailSage Logo"
            width={32}
            height={32}
            priority
          />
          <span className="font-semibold md:inline hidden">MailSage</span>
        </Link>
        <div className="flex-1" />
        <nav className="hidden md:flex items-center space-x-4">
          {navigationItems}
        </nav>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle className="pb-4">
              Menu
            </SheetTitle>
            <nav className="flex flex-col space-y-4">
              {mobileNavigationItems}
            </nav>
          </SheetContent>
        </Sheet>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="ml-2"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}

