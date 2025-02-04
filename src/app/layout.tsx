import { Inter } from 'next/font/google'
import { Providers } from '@/app/providers'
import './globals.css'
import '@/styles/docs/github-markdown.css'
import '@/styles/docs/prism-github.css'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | MailSage',
    default: 'MailSage - Email Management Made Simple'
  },
  description: 'Modern email infrastructure for developers and businesses',
  icons: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      media: '(prefers-color-scheme: light)',
      url: '/favicon-light.svg',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      media: '(prefers-color-scheme: dark)',
      url: '/favicon-dark.svg',
    },
    {
      rel: 'icon',
      type: 'image/png',
      media: '(prefers-color-scheme: light)',
      url: '/favicon-32x32.png',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      type: 'image/png',
      media: '(prefers-color-scheme: dark)',
      url: '/favicon-32x32.png',
      sizes: '32x32',
    },
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
      sizes: '180x180',
    },
  ],
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
