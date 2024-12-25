import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { ArrowRight, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="py-20 md:py-40 gradient-bg">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-6xl font-semibold mb-6 text-white">Welcome to mailSage</h1>
            <p className="text-xl md:text-2xl mb-8 text-white/80">Powerful email management for developers and businesses</p>
            <div className="space-x-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/docs">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-semibold mb-10 text-center gradient-text">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 border border-border rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-4">Easy SMTP Configuration</h3>
                <p className="text-muted-foreground">Set up and manage multiple SMTP configurations with ease.</p>
              </div>
              <div className="text-center p-6 border border-border rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-4">Email Templates</h3>
                <p className="text-muted-foreground">Create and manage reusable email templates for quick sending.</p>
              </div>
              <div className="text-center p-6 border border-border rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-4">Comprehensive Analytics</h3>
                <p className="text-muted-foreground">Track and analyze your email performance with detailed insights.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-muted px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-semibold mb-10 text-center gradient-text">Why Choose mailSage?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-medium mb-2">Reliable Delivery</h3>
                  <p className="text-muted-foreground">Our advanced infrastructure ensures your emails reach their destination.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-medium mb-2">Developer-Friendly</h3>
                  <p className="text-muted-foreground">Easy-to-use APIs and SDKs for seamless integration into your applications.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-medium mb-2">Scalable Solution</h3>
                  <p className="text-muted-foreground">Grow your email operations without worrying about infrastructure limitations.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-medium mb-2">Detailed Reporting</h3>
                  <p className="text-muted-foreground">Get insights into your email performance with our comprehensive analytics.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-6 gradient-text">Ready to get started?</h2>
            <p className="text-xl mb-8 text-muted-foreground">Join thousands of developers and businesses who trust mailSage for their email needs.</p>
            <Button asChild size="lg" className="gradient-bg">
              <Link href="/register">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="bg-muted py-6 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2023 mailSage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

