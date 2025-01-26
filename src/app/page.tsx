"use client"

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { ArrowRight, Mail, Lock, Zap, BarChart3, Server, Repeat, Terminal, Copy, CheckCircle } from 'lucide-react'

const companies = [
  { name: 'GitHub', logo: '/logos/github5.svg' },
  { name: 'Google', logo: '/logos/google.svg' },
  { name: 'Microsoft', logo: '/logos/microsoft.svg' },
  { name: 'Amazon', logo: '/logos/amazon.svg' },
]

const codeExample = `curl -X POST https://api.mailsage.io/v1/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "user@example.com",
    "subject": "Welcome to MailSage!",
    "template_id": "welcome-email",
    "variables": {
      "name": "John Doe",
      "company": "Acme Inc"
    }
  }'`

export default function LandingPage() {
  const [isPaused, setIsPaused] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header className="fixed top-0 z-50 w-full border-b" />
      <main className="flex-grow">
        {/* Hero Section with Wave Background */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background Patterns */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 blur-[100px]" />
            <div className="absolute right-0 top-0 -z-10 h-[310px] w-[310px] rounded-full bg-secondary/5 blur-[100px]" />
            <div className="absolute bottom-0 left-0 -z-10 h-[310px] w-[310px] rounded-full bg-primary/5 blur-[100px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-8">
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
                  🚀 <span className="ml-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Launching our new API v2</span>
                </div>
                <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold !leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-text">
                  Modern Email Infrastructure
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Powerful email management platform for developers and businesses. Send, track, and manage your emails with ease.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="gradient-bg">
                    <Link href="/register">Get Started Free</Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    <Link href="/docs">View Documentation</Link>
                  </Button>
                </div>
                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    14-day free trial
                  </div>
                </div>
              </div>
              <div className="relative lg:block">
                <div className="relative rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <div className="flex gap-1">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Terminal className="h-4 w-4" />
                      <span>Terminal</span>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="overflow-x-auto p-4 text-sm font-mono">
                    <code className="text-primary">{codeExample}</code>
                  </pre>
                </div>
                <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-xl bg-gradient-to-r from-primary to-secondary opacity-20 blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Logos Section */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container px-4">
            <p className="text-center text-sm text-muted-foreground mb-8">Trusted by developers from</p>
            <div className="relative w-full overflow-hidden">
              <div
                ref={scrollerRef}
                className={`scroller ${isPaused ? 'paused' : ''}`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="scroller-inner">
                  {[...companies, ...companies].map((company, index) => (
                    <div key={index} className="flex-shrink-0 mx-8">
                      <div className="w-40 h-20 relative flex items-center justify-center">
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={120}
                          height={40}
                          className="company-logo"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Everything You Need
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built for developers, designed for scale. All the features you need to send emails with confidence.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <Mail className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">SMTP Integration</h3>
                <p className="text-muted-foreground">Multiple SMTP configurations with automatic failover and load balancing.</p>
              </div>
              <div className="group p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <Lock className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">Secure by Default</h3>
                <p className="text-muted-foreground">Enterprise-grade security with encryption at rest and in transit.</p>
              </div>
              <div className="group p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <Zap className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">Real-time Delivery</h3>
                <p className="text-muted-foreground">Instant email delivery with real-time tracking and webhooks.</p>
              </div>
              <div className="group p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <BarChart3 className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">Detailed insights into delivery rates, opens, clicks, and more.</p>
              </div>
              <div className="group p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <Server className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">API First</h3>
                <p className="text-muted-foreground">RESTful APIs and SDKs for seamless integration into your stack.</p>
              </div>
              <div className="group p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <Repeat className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">Auto Scaling</h3>
                <p className="text-muted-foreground">Automatically scales with your email volume needs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section with Animated Numbers */}
        <section className="relative py-20 overflow-hidden bg-muted/30">
          <div className="container relative z-10 mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-count">
                  99.9%
                </div>
                <p className="text-muted-foreground">Delivery Rate</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-count">
                  10ms
                </div>
                <p className="text-muted-foreground">Average Response Time</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-count">
                  24/7
                </div>
                <p className="text-muted-foreground">Support Available</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          <div className="container relative mx-auto text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join thousands of developers who trust MailSage for their email infrastructure.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gradient-bg">
                  Start for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="dark:hidden">
                <Image
                  src="/navbarLogo-dark.svg"
                  alt="MailSage Logo"
                  width={38}
                  height={38}
                  priority
                />
              </div>
              <div className="hidden dark:block">
                <Image
                  src="/navbarLogo-light.svg"
                  alt="MailSage Logo"
                  width={38}
                  height={38}
                  priority
                />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Modern email infrastructure for developers and businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-primary">Documentation</Link></li>
                <li><Link href="/changelog" className="hover:text-primary">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">About</Link></li>
                <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-primary">Security</Link></li>
                <li><Link href="/gdpr" className="hover:text-primary">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MailSage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

