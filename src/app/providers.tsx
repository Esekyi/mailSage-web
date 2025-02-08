"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "sonner"
import { TimezoneProvider } from '@/providers/timezone-provider'
import { useEffect } from "react"
import { DynamicFavicon } from '@/components/dynamic-favicon'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

function ThemeWatcher() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      document.documentElement.classList.toggle('dark', mediaQuery.matches)
    }
    mediaQuery.addEventListener('change', handleChange)
    handleChange() // Initial check
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="mailsage-theme"
      >
        <ThemeWatcher />
        <DynamicFavicon />
        <TimezoneProvider>
          {children}
          <Toaster
            theme="system"
            className="dark:bg-background dark:text-foreground"
            richColors={true}
          />
        </TimezoneProvider>
      </NextThemesProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
