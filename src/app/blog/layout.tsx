import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest news, updates, and insights about email infrastructure, deliverability, and best practices.',
  openGraph: {
    title: 'MailSage Blog',
    description: 'Latest news, updates, and insights about email infrastructure, deliverability, and best practices.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MailSage Blog',
    description: 'Latest news, updates, and insights about email infrastructure, deliverability, and best practices.',
  }
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
