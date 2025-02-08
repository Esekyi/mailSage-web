import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features',
  description: 'Explore MailSage\'s powerful features including SMTP integration, enterprise security, real-time analytics, global infrastructure, developer APIs, and webhook integration.',
  openGraph: {
    title: 'MailSage Features',
    description: 'Explore MailSage\'s powerful features including SMTP integration, enterprise security, real-time analytics, global infrastructure, developer APIs, and webhook integration.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MailSage Features',
    description: 'Explore MailSage\'s powerful features including SMTP integration, enterprise security, real-time analytics, global infrastructure, developer APIs, and webhook integration.',
  }
}

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
