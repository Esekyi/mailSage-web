import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/header'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For personal projects',
    features: ['1,000 emails/month', '1 SMTP configuration', 'Basic templates', 'Email support'],
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For growing businesses',
    features: ['50,000 emails/month', '5 SMTP configurations', 'Advanced templates', 'Priority support'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale operations',
    features: ['Unlimited emails', 'Unlimited SMTP configurations', 'Custom templates', 'Dedicated support'],
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-20">
        <div className="container mx-auto">
          <h1 className="text-4xl font-semibold text-center mb-12">Pricing Plans</h1>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-primary' : ''}`}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-3xl font-semibold mb-4">{plan.price}</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}>
                    <Link href="/register">Choose Plan</Link>
                  </Button>
                </CardFooter>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                    Popular
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>
      <footer className="bg-secondary py-6 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2023 mailSage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

