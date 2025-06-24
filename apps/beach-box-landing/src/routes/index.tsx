import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  HeroSplit,
  FeaturesGrid,
  StatsSimple,
  TestimonialsGrid,
  CTASimple
} from '@beach-box/unify-ui'
import { DollarSign, Shield, Clock, Users, Award, TrendingUp, CheckCircle, Building } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="beach-box-hero">
        <HeroSplit
          badge={{
            text: "Trusted by 50+ Florida Venues",
            icon: <Award className="w-4 h-4" />
          }}
          title="Turn Sun Safety Into a Profit Center"
          description="Partner with Beach Box to add a revenue-generating amenity that enhances guest experience while requiring zero effort from your team."
          features={[
            "Generate passive income through revenue sharing",
            "Zero upfront costs or maintenance responsibilities",
            "Enhance guest satisfaction and safety",
            "Full insurance coverage and liability protection"
          ]}
          primaryCta={{
            text: "Apply for Partnership",
            onClick: () => navigate({ to: '/contact', search: { subject: undefined, model: undefined } })
          }}
          secondaryCta={{
            text: "View Partnership Models",
            href: "/partnership-models"
          }}
          image={{
            src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
            alt: "Luxurious hotel pool area with Beach Box sunscreen vending machine"
          }}
          stats={[
            { value: "$800", label: "Avg Monthly Revenue" },
            { value: "0", label: "Upfront Costs" },
            { value: "95%", label: "Partner Retention" }
          ]}
          backgroundImage={undefined}
        />
      </section>

      {/* Partnership Benefits Section */}
      <section className="py-20 bg-gray-50">
        <FeaturesGrid
          title="Why Venue Owners Choose Beach Box"
          description="A complete turnkey solution that benefits your business and your guests"
          columns={4}
          features={[
            {
              icon: DollarSign,
              title: "Generate Revenue",
              description: "Earn commission on every sale with our generous revenue-sharing model. Average partners earn $500-1,200 monthly."
            },
            {
              icon: Shield,
              title: "Zero Risk",
              description: "No upfront costs, no maintenance responsibilities. We handle everything and provide full liability coverage."
            },
            {
              icon: Users,
              title: "Happy Guests",
              description: "Guests love the convenience. 95% of partner venues report improved guest satisfaction scores."
            },
            {
              icon: Clock,
              title: "Hands-Off Operation",
              description: "Remote monitoring, automatic restocking, and 24/7 maintenance. Your staff does nothing."
            }
          ]}
        />
      </section>

      {/* Revenue Calculator Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Potential Revenue Calculator</h2>
            <p className="text-xl text-muted-foreground mb-12">
              See how much your venue could earn with a Beach Box partnership
            </p>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-beach-600 mb-2">50-100</div>
                  <p className="text-gray-600">Daily Visitors</p>
                  <div className="text-2xl font-bold text-green-600 mt-4">$300-600</div>
                  <p className="text-sm text-gray-500">Estimated Monthly Revenue</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-beach-600 mb-2">100-200</div>
                  <p className="text-gray-600">Daily Visitors</p>
                  <div className="text-2xl font-bold text-green-600 mt-4">$600-1,200</div>
                  <p className="text-sm text-gray-500">Estimated Monthly Revenue</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-beach-600 mb-2">200+</div>
                  <p className="text-gray-600">Daily Visitors</p>
                  <div className="text-2xl font-bold text-green-600 mt-4">$1,200+</div>
                  <p className="text-sm text-gray-500">Estimated Monthly Revenue</p>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                *Based on average 1-2% purchase rate and 25% revenue share
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Success Stats */}
      <section className="py-20 bg-gray-50">
        <StatsSimple
          title="Proven Success Across Florida"
          description="Join our growing network of successful venue partners"
          columns={4}
          stats={[
            {
              icon: Building,
              value: "50",
              suffix: "+",
              label: "Partner Venues",
              trend: { value: 25, isPositive: true }
            },
            {
              icon: DollarSign,
              value: "$125K",
              suffix: "+",
              label: "Partner Revenue Generated",
              trend: { value: 40, isPositive: true }
            },
            {
              icon: Users,
              value: "95",
              suffix: "%",
              label: "Guest Satisfaction Improvement",
              description: "Venues report higher ratings"
            },
            {
              icon: TrendingUp,
              value: "95",
              suffix: "%",
              label: "Partner Retention Rate",
              description: "Year-over-year renewals"
            }
          ]}
        />
      </section>

      {/* Partner Testimonials */}
      <section className="py-20">
        <TestimonialsGrid
          title="What Our Partners Say"
          description="Hear from venue managers who've added Beach Box to their properties"
          columns={3}
          testimonials={[
            {
              content: "Beach Box has been a fantastic addition to our resort. Zero maintenance for us, and we're earning $1,200 monthly in pure passive income. Our guests love the convenience.",
              author: {
                name: "Jennifer Martinez",
                role: "General Manager",
                company: "Oceanfront Resort Miami",
                avatar: "https://i.pravatar.cc/150?img=1"
              },
              rating: 5
            },
            {
              content: "As a city parks director, I was skeptical about vending partnerships. Beach Box changed my mind - they handle everything, we collect rent, and residents appreciate the sun safety.",
              author: {
                name: "Robert Chen",
                role: "Parks Director",
                company: "City of Clearwater",
                avatar: "https://i.pravatar.cc/150?img=2"
              },
              rating: 5
            },
            {
              content: "Our guest satisfaction scores improved 15% after installing Beach Box. It's one of those amenities that guests remember and mention in reviews.",
              author: {
                name: "Michael Torres",
                role: "Resort Operations Manager",
                company: "Key West Beach Resort",
                avatar: "https://i.pravatar.cc/150?img=3"
              },
              rating: 5
            }
          ]}
        />
      </section>

      {/* Partnership Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Simple Partnership Process</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-beach-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Apply</h3>
                <p className="text-gray-600">Submit your venue details and we'll evaluate the partnership fit</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-beach-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Site Visit</h3>
                <p className="text-gray-600">Our team visits to determine optimal placement and finalize terms</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-beach-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Installation</h3>
                <p className="text-gray-600">Professional installation with all permits and setup handled by us</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-beach-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Earn</h3>
                <p className="text-gray-600">Start earning passive income while we handle all operations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-beach-50">
        <CTASimple
          title="Ready to Add a Revenue-Generating Amenity?"
          description="Join 50+ successful venue partners across Florida. Apply today and start earning passive income."
          variant="default"
          primaryCta={{
            text: "Apply for Partnership",
            onClick: () => navigate({ to: '/contact', search: { subject: undefined, model: undefined } })
          }}
          secondaryCta={{
            text: "View Partnership Models",
            href: "/partnership-models"
          }}
        />
      </section>

      <Link to="/dashboard" style={{ display: 'inline-block', margin: '24px 0', padding: '12px 24px', background: '#2563eb', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>
        Go to Dashboard
      </Link>
    </div>
  )
}