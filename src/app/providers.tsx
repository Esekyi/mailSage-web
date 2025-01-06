'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { TimezoneProvider } from '@/providers/timezone-provider'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TimezoneProvider>
          {children}
          <Toaster
            theme="system"
            className="dark:bg-background dark:text-foreground"
            // toastOptions={{
            //   style: {
            //     background: 'hsl(var(--background))',
            //     color: 'hsl(var(--foreground))',
            //     border: '1px solid hsl(var(--border))',
            //   },
            // }}
            richColors={true}
          />
        </TimezoneProvider>
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
