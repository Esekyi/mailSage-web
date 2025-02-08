import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Stay up to date with the latest features, improvements, and fixes in MailSage. Track our journey as we continuously enhance your email infrastructure experience.',
  openGraph: {
    title: 'MailSage Changelog',
    description: 'Stay up to date with the latest features, improvements, and fixes in MailSage. Track our journey as we continuously enhance your email infrastructure experience.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MailSage Changelog',
    description: 'Stay up to date with the latest features, improvements, and fixes in MailSage. Track our journey as we continuously enhance your email infrastructure experience.',
  }
}

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
