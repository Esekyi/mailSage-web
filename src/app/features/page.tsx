"use client"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import Link from "next/link"
import {
  Mail,
  Lock,
  BarChart3,
  Globe,
  Code,
  Webhook,
  ArrowRight,
} from "lucide-react"

const features = [
  {
    title: "SMTP Integration",
    description: "Multiple SMTP configurations with automatic failover and load balancing for reliable email delivery.",
    icon: Mail,
    category: "Core Features",
    details: [
      "Multiple SMTP server support",
      "Automatic failover handling",
      "Load balancing across servers",
      "Real-time server health monitoring",
    ],
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade security with encryption at rest and in transit, plus advanced access controls.",
    icon: Lock,
    category: "Security",
    details: [
      "End-to-end encryption",
      "Role-based access control",
      "Audit logging",
      "Two-factor authentication",
    ],
  },
  {
    title: "Real-time Analytics",
    description: "Comprehensive analytics and tracking for all your email campaigns and transactional emails.",
    icon: BarChart3,
    category: "Analytics",
    details: [
      "Delivery tracking",
      "Open and click rates",
      "Bounce analytics",
      "Engagement metrics",
    ],
  },
  {
    title: "Global Infrastructure",
    description: "Distributed infrastructure across multiple regions for optimal delivery and redundancy.",
    icon: Globe,
    category: "Infrastructure",
    details: [
      "Multi-region deployment",
      "Automatic scaling",
      "99.99% uptime SLA",
      "Global CDN integration",
    ],
  },
  {
    title: "Developer API",
    description: "RESTful APIs and SDKs for seamless integration into your existing infrastructure.",
    icon: Code,
    category: "Developer Tools",
    details: [
      "RESTful API access",
      "Multiple SDK options",
      "Comprehensive documentation",
      "API version control",
    ],
  },
  {
    title: "Webhook Integration",
    description: "Real-time event notifications for deep integration with your systems.",
    icon: Webhook,
    category: "Integration",
    details: [
      "Custom webhook endpoints",
      "Event filtering",
      "Retry mechanisms",
      "Webhook logs",
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 blur-[100px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-text">
                Powerful Features for Modern Email Infrastructure
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Everything you need to build, send, and manage your email operations at scale.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="gradient-bg">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline" size="lg">
                    View Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <feature.icon className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4 overflow-hidden bg-muted/30">
          <div className="container relative mx-auto text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Ready to Experience MailSage?
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Start sending emails with confidence using our powerful infrastructure.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gradient-bg">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer is handled by the layout.tsx */}
    </div>
  )
}
