'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@beach-box/unify-ui';
import {
  Shield,
  Users,
  CreditCard,
  BarChart3,
  Zap,
  Globe
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with SOC 2 compliance and audit logging.',
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'User management with role-based permissions.',
    },
    {
      icon: CreditCard,
      title: 'Billing & Subscriptions',
      description: 'Automated billing with multiple pricing tiers.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time dashboards and business intelligence.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with edge computing.',
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Multi-region deployment with 99.9% uptime SLA.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">SaaS Starter</span>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => router.push('/signin')}>
                    Sign In
                  </Button>
                  <Button onClick={() => router.push('/signup')}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Build Your SaaS Business
            <span className="text-blue-600"> Faster</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The complete multi-tenant platform with built-in billing, team management,
            and enterprise features. Launch your SaaS in days, not months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/signup')}
              className="px-8 py-3"
            >
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/demo')}
              className="px-8 py-3"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-lg text-gray-600">
              Built-in features that would take months to develop from scratch
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-blue-600 mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of companies already using our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/signup')}
              className="px-8 py-3"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/contact')}
              className="px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">SaaS Starter</span>
            </div>
            <p className="text-gray-600">
              © 2024 SaaS Starter. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
