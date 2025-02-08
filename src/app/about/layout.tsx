import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Built for Africa, Ready for the World. MailSage is a product of Vylis, creating intuitive, reliable technology that solves real African business challenges.',
  openGraph: {
    title: 'About MailSage',
    description: 'Built for Africa, Ready for the World. MailSage is a product of Vylis, creating intuitive, reliable technology that solves real African business challenges.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About MailSage',
    description: 'Built for Africa, Ready for the World. MailSage is a product of Vylis, creating intuitive, reliable technology that solves real African business challenges.',
  }
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
