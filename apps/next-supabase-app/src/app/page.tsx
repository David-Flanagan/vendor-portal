'use client';

import {
  HeroCentered,
  FeaturesGrid,
  PricingCards,
  TestimonialsGrid,
  FAQAccordion,
  CTASimple,
  StatsSimple,
  LogoCloud,
  Container,
  Button
} from '@beach-box/unify-ui';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import {
  Shield,
  Users,
  CreditCard,
  BarChart3,
  Zap,
  Globe,
  Lock,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with SOC 2 compliance, SSO integration, and advanced audit logging.',
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Comprehensive user management with role-based permissions and team collaboration tools.',
    },
    {
      icon: CreditCard,
      title: 'Billing & Subscriptions',
      description: 'Automated billing with multiple pricing tiers, usage tracking, and revenue optimization.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time dashboards with custom metrics, reporting, and business intelligence.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with edge computing, caching, and global CDN distribution.',
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Multi-region deployment with 99.9% uptime SLA and automatic scaling.',
    },
    {
      icon: Lock,
      title: 'Data Privacy',
      description: 'GDPR compliant with data encryption, privacy controls, and compliance monitoring.',
    },
    {
      icon: Smartphone,
      title: 'Multi-Platform',
      description: 'Responsive design with mobile apps, desktop clients, and API integrations.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 29,
      billing: 'monthly',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 5 team members',
        '10GB storage',
        'Basic analytics',
        'Email support',
        'Core integrations',
      ],
      popular: false,
      ctaText: 'Start Free Trial',
      ctaAction: () => router.push('/signup'),
    },
    {
      name: 'Professional',
      price: 99,
      billing: 'monthly',
      description: 'Best for growing businesses',
      features: [
        'Up to 25 team members',
        '100GB storage',
        'Advanced analytics',
        'Priority support',
        'All integrations',
        'Custom branding',
        'API access',
      ],
      popular: true,
      ctaText: 'Start Free Trial',
      ctaAction: () => router.push('/signup'),
    },
    {
      name: 'Enterprise',
      price: 299,
      billing: 'monthly',
      description: 'For large organizations',
      features: [
        'Unlimited team members',
        '1TB storage',
        'Custom analytics',
        'Dedicated support',
        'White-label solution',
        'SSO & SAML',
        'Custom integrations',
        'SLA guarantee',
      ],
      popular: false,
      ctaText: 'Contact Sales',
      ctaAction: () => router.push('/contact'),
    },
  ];

  const testimonials = [
    {
      content: "This platform has revolutionized how we manage our business. The multi-tenant architecture is exactly what we needed.",
      author: "Sarah Johnson",
      role: "CTO",
      company: "TechFlow",
      avatar: "/testimonials/sarah.jpg",
    },
    {
      content: "The billing system is incredibly robust. We've seen a 40% increase in subscription retention since switching.",
      author: "Michael Chen",
      role: "Head of Operations",
      company: "ScaleUp",
      avatar: "/testimonials/michael.jpg",
    },
    {
      content: "Best-in-class security and compliance features. Our enterprise clients love the audit capabilities.",
      author: "Emily Rodriguez",
      role: "Security Director",
      company: "SecureTech",
      avatar: "/testimonials/emily.jpg",
    },
  ];

  const faqs = [
    {
      question: "How does the multi-tenant architecture work?",
      answer: "Our platform provides complete data isolation between organizations while maintaining shared infrastructure for optimal performance and cost efficiency.",
    },
    {
      question: "What billing models are supported?",
      answer: "We support subscription billing, usage-based pricing, one-time payments, and custom enterprise agreements with automated invoicing and revenue recognition.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we implement enterprise-grade security including encryption at rest and in transit, SOC 2 compliance, regular security audits, and advanced access controls.",
    },
    {
      question: "Can I customize the platform for my brand?",
      answer: "Absolutely! Professional and Enterprise plans include white-label options, custom branding, and the ability to configure the platform to match your company's identity.",
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide email support for Starter plans, priority chat and phone support for Professional plans, and dedicated account management for Enterprise customers.",
    },
  ];

  const stats = [
    { label: 'Active Companies', value: '10,000+' },
    { label: 'Monthly Transactions', value: '$2.5M+' },
    { label: 'Uptime Guarantee', value: '99.9%' },
    { label: 'Countries Served', value: '50+' },
  ];

  const logoClients = [
    { name: 'Company 1', logo: '/logos/company1.svg' },
    { name: 'Company 2', logo: '/logos/company2.svg' },
    { name: 'Company 3', logo: '/logos/company3.svg' },
    { name: 'Company 4', logo: '/logos/company4.svg' },
    { name: 'Company 5', logo: '/logos/company5.svg' },
    { name: 'Company 6', logo: '/logos/company6.svg' },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">SaaS Starter</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
                Testimonials
              </a>
              <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
                FAQ
              </a>
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
        </Container>
      </nav>

      {/* Hero Section */}
      <HeroCentered
        title="Build Your SaaS Business Faster"
        subtitle="The complete multi-tenant platform with built-in billing, team management, and enterprise features. Launch your SaaS in days, not months."
        actions={[
          {
            text: 'Start Free Trial',
            href: '/signup',
            variant: 'default'
          },
          {
            text: 'View Demo',
            href: '/demo',
            variant: 'outline'
          }
        ]}
        image={{
          src: '/hero-dashboard.png',
          alt: 'SaaS Starter Dashboard'
        }}
      />

      {/* Logo Cloud */}
      <section className="py-12 bg-muted/50">
        <Container>
          <LogoCloud
            title="Trusted by leading companies"
            logos={logoClients}
          />
        </Container>
      </section>

      {/* Stats */}
      <section className="py-16">
        <Container>
          <StatsSimple stats={stats} />
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-muted/50">
        <Container>
          <FeaturesGrid
            title="Everything You Need to Scale"
            subtitle="Built-in features that would take months to develop from scratch"
            features={features}
          />
        </Container>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that's right for your business
            </p>
          </div>
          <PricingCards plans={pricingPlans} />
        </Container>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-muted/50">
        <Container>
          <TestimonialsGrid
            title="Loved by Businesses Worldwide"
            subtitle="See what our customers are saying about their experience"
            testimonials={testimonials}
          />
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to know about the platform
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqs} />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <CTASimple
        title="Ready to Transform Your Business?"
        subtitle="Join thousands of companies already using our platform to scale their operations."
        actions={[
          {
            text: 'Start Free Trial',
            href: '/signup',
            variant: 'default'
          },
          {
            text: 'Contact Sales',
            href: '/contact',
            variant: 'outline'
          }
        ]}
      />

      {/* Footer */}
      <footer className="border-t bg-background">
        <Container>
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl">SaaS Starter</span>
                </div>
                <p className="text-muted-foreground">
                  The complete platform for building scalable SaaS businesses.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                  <li><a href="/docs" className="hover:text-foreground transition-colors">Documentation</a></li>
                  <li><a href="/api" className="hover:text-foreground transition-colors">API Reference</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="/about" className="hover:text-foreground transition-colors">About</a></li>
                  <li><a href="/blog" className="hover:text-foreground transition-colors">Blog</a></li>
                  <li><a href="/careers" className="hover:text-foreground transition-colors">Careers</a></li>
                  <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                  <li><a href="/security" className="hover:text-foreground transition-colors">Security</a></li>
                  <li><a href="/compliance" className="hover:text-foreground transition-colors">Compliance</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground">
                © 2024 SaaS Starter. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
