import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Providers } from '@/app/providers'
import { DynamicFavicon } from '@/components/dynamic-favicon'
import './globals.css'
import '@/styles/docs/github-markdown.css'
import '@/styles/docs/prism-github.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'MailSage',
  description: 'Email management platform for developers and businesses',
  icons: [
    { rel: 'icon', url: '/favicon-light.svg', type: 'image/svg+xml' },
    { rel: 'icon', url: '/favicon-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
    { rel: 'alternate icon', url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { rel: 'alternate icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png', sizes: '180x180' },
    { rel: 'manifest', url: '/site.webmanifest' },
    { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#5bbad5' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <DynamicFavicon />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
