'use client'

import { Facebook, Linkedin, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }
  ]

  return (
    <div className="flex gap-2">
      {shareLinks.map(({ name, icon: Icon, href }) => (
        <Button
          key={name}
          variant="outline"
          size="icon"
          onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
          aria-label={`Share on ${name}`}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  )
}
