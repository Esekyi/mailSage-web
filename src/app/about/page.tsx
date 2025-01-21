"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import { ArrowRight, Globe, Zap, Shield, Users, Sparkles, Building } from "lucide-react"

const values = [
  {
    icon: Sparkles,
    title: "Innovation with Purpose",
    description: "Building technology that solves real problems, not just innovation for innovation's sake."
  },
  {
    icon: Globe,
    title: "African-first Design",
    description: "Solutions built for African market realities, understanding local infrastructure and business needs."
  },
  {
    icon: Shield,
    title: "Reliability",
    description: "Rock-solid infrastructure that businesses can depend on, backed by enterprise-grade security."
  },
  {
    icon: Zap,
    title: "Simplicity",
    description: "Making complex technology accessible and user-friendly without compromising on power."
  },
  {
    icon: Users,
    title: "Growth-focused",
    description: "Enabling business growth through technology that scales with your needs."
  },
  {
    icon: Building,
    title: "Enterprise for All",
    description: "Enterprise features and security accessible to businesses of all sizes."
  }
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden border-b">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/5 blur-[100px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-text">
                Built for Africa, Ready for the World
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                MailSage is a product of Vylis, creating intuitive, reliable technology that solves real African business challenges.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Our Vision</h2>
                <p className="text-lg text-muted-foreground">
                  To build transformative technology solutions that empower African businesses and communities to thrive in the digital age.
                </p>
                <div className="pt-4">
                  <Link href="/contact">
                    <Button className="gradient-bg">
                      Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Our Mission</h2>
                <p className="text-lg text-muted-foreground">
                  Creating intuitive, reliable technology that solves real African business challenges, starting with communication and spaces.
                </p>
                <div className="pt-4">
                  <Link href="/docs">
                    <Button variant="outline">
                      Read Documentation
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground">
                Core principles that guide everything we do at Vylis and MailSage.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-background border border-border hover:shadow-lg transition-all"
                >
                  <value.icon className="h-8 w-8 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Architecture */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Our Products</h2>
              <p className="text-lg text-muted-foreground">
                A suite of integrated solutions designed for African businesses.
              </p>
            </div>
            <div className="space-y-8">
              <div className="p-8 rounded-xl bg-card border border-border hover:shadow-lg transition-all">
                <h3 className="text-2xl font-bold mb-2">MailSage</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Powerful email infrastructure for African businesses. Built for reliability, designed for scale.
                </p>
                <div className="flex gap-4">
                  <Link href="/features">
                    <Button variant="outline">
                      Explore Features
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="gradient-bg">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="p-8 rounded-xl bg-card border border-border hover:shadow-lg transition-all opacity-75">
                <h3 className="text-2xl font-bold mb-2">Spaces</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Transforming how Africa lives and works. Coming soon.
                </p>
                <Button variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4 overflow-hidden bg-muted/30">
          <div className="container relative mx-auto text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-muted-foreground">
              Join forward-thinking African businesses using MailSage to power their communication infrastructure.
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
    </div>
  )
}
