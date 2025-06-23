import { createFileRoute } from '@tanstack/react-router'
import { HeroCentered, StatsSimple, CTASimple } from '@beach-box/unify-ui'
import { TrendingUp, Users, DollarSign, Star, MapPin, Building } from 'lucide-react'

export const Route = createFileRoute('/locations')({
  component: CaseStudies,
})

interface CaseStudy {
  id: string
  name: string
  type: 'resort' | 'hotel' | 'government' | 'pool'
  location: string
  partnership: 'revenue-share' | 'rental' | 'lease'
  monthlyRevenue: string
  guestSatisfaction: string
  installDate: string
  quote: string
  manager: string
  title: string
  results: {
    before: string
    after: string
    improvement: string
  }[]
}

const caseStudies: CaseStudy[] = [
  {
    id: '1',
    name: 'Oceanfront Resort Miami',
    type: 'resort',
    location: 'Miami Beach, FL',
    partnership: 'revenue-share',
    monthlyRevenue: '$3,200',
    guestSatisfaction: '18% increase',
    installDate: 'March 2024',
    quote: "Beach Box has been a game-changer for our resort. Our guests love the convenience, and we're earning significant passive income. The installation was seamless and their support is outstanding.",
    manager: 'Jennifer Martinez',
    title: 'General Manager',
    results: [
      {
        before: 'Guest complaints about sunscreen availability',
        after: 'Zero complaints, improved TripAdvisor ratings',
        improvement: '18% satisfaction increase'
      },
      {
        before: 'No poolside revenue streams',
        after: 'Consistent monthly passive income',
        improvement: '$3,200 monthly revenue'
      },
      {
        before: 'Staff time spent on sunscreen requests',
        after: 'Zero staff involvement needed',
        improvement: '12 hours/week saved'
      }
    ]
  },
  {
    id: '2',
    name: 'City of Clearwater Parks',
    type: 'government',
    location: 'Clearwater, FL',
    partnership: 'rental',
    monthlyRevenue: '$800',
    guestSatisfaction: '22% increase',
    installDate: 'January 2024',
    quote: "As a public facility, we needed a solution that was both beneficial for residents and fiscally responsible. Beach Box's rental model provides guaranteed income while serving our community's sun safety needs.",
    manager: 'Robert Chen',
    title: 'Parks Director',
    results: [
      {
        before: 'Budget constraints for free sunscreen program',
        after: 'Self-funding sun safety amenity',
        improvement: '$800 monthly income'
      },
      {
        before: 'Resident complaints about sunscreen costs',
        after: 'Convenient, affordable on-site access',
        improvement: '22% satisfaction increase'
      },
      {
        before: 'Maintenance burden on staff',
        after: 'Zero maintenance responsibilities',
        improvement: 'Full outsourced service'
      }
    ]
  },
  {
    id: '3',
    name: 'Key West Beach Resort',
    type: 'hotel',
    location: 'Key West, FL',
    partnership: 'lease',
    monthlyRevenue: '$6,500',
    guestSatisfaction: '15% increase',
    installDate: 'February 2024',
    quote: "With our large operation, the lease model made perfect sense. We keep all the revenue and have full control over pricing and inventory. Beach Box's support team made the transition smooth.",
    manager: 'Michael Torres',
    title: 'Resort Operations Manager',
    results: [
      {
        before: 'High gift shop sunscreen markup complaints',
        after: 'Competitive poolside pricing',
        improvement: '15% satisfaction increase'
      },
      {
        before: 'Limited revenue from pool amenities',
        after: 'Significant new revenue stream',
        improvement: '$6,500 monthly revenue'
      },
      {
        before: 'Seasonal sunscreen inventory challenges',
        after: 'Predictable demand and supply',
        improvement: 'Streamlined operations'
      }
    ]
  }
]

function CaseStudies() {
  return (
    <div className="flex flex-col pt-20">
      {/* Hero Section */}
      <section className="pb-20">
        <HeroCentered
          title="Real Results from Real Partners"
          description="See how Beach Box partnerships are generating revenue and improving guest satisfaction across Florida."
          announcement={undefined}
          socialProof={undefined}
          backgroundImage={undefined}
          primaryCta={{
            text: "Schedule Your Consultation",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "View Partnership Models",
            href: "/partnership-models"
          }}
        />
      </section>

      {/* Overall Stats */}
      <section className="py-20 bg-gray-50">
        <StatsSimple
          title="Partnership Success Metrics"
          description="Aggregate results from our venue partners"
          columns={4}
          stats={[
            {
              icon: DollarSign,
              value: "$125K",
              suffix: "+",
              label: "Total Partner Revenue",
              description: "Generated in 2024"
            },
            {
              icon: TrendingUp,
              value: "18",
              suffix: "%",
              label: "Average Satisfaction Increase",
              description: "Reported by partners"
            },
            {
              icon: Users,
              value: "95",
              suffix: "%",
              label: "Partner Retention Rate",
              description: "Year-over-year renewals"
            },
            {
              icon: Star,
              value: "4.9",
              suffix: "/5",
              label: "Partner Rating",
              description: "From partner surveys"
            }
          ]}
        />
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Partner Success Stories</h2>

            <div className="space-y-16">
              {caseStudies.map((study) => (
                <div key={study.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left side - Info */}
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-beach-100 rounded-full flex items-center justify-center">
                          <Building className="h-6 w-6 text-beach-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{study.name}</h3>
                          <p className="text-gray-600 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {study.location}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{study.monthlyRevenue}</div>
                          <p className="text-sm text-gray-600">Monthly Revenue</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{study.guestSatisfaction}</div>
                          <p className="text-sm text-gray-600">Satisfaction Boost</p>
                        </div>
                      </div>

                      <blockquote className="text-lg italic text-gray-700 mb-4">
                        "{study.quote}"
                      </blockquote>

                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                        <div>
                          <p className="font-semibold">{study.manager}</p>
                          <p className="text-sm text-gray-600">{study.title}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Results */}
                    <div className="bg-gray-50 p-8">
                      <h4 className="text-xl font-semibold mb-6">Results & Impact</h4>
                      <div className="space-y-6">
                        {study.results.map((result, index) => (
                          <div key={index} className="border-l-4 border-beach-500 pl-4">
                            <div className="mb-2">
                              <span className="text-sm font-medium text-red-600">Before:</span>
                              <p className="text-sm text-gray-600">{result.before}</p>
                            </div>
                            <div className="mb-2">
                              <span className="text-sm font-medium text-green-600">After:</span>
                              <p className="text-sm text-gray-600">{result.after}</p>
                            </div>
                            <div className="bg-beach-100 px-3 py-1 rounded-full inline-block">
                              <span className="text-sm font-medium text-beach-700">{result.improvement}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Partnership Model:</span>
                          <span className="font-medium capitalize">{study.partnership.replace('-', ' ')}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>Install Date:</span>
                          <span className="font-medium">{study.installDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Calculate Your Potential ROI</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Based on real data from our partner venues
            </p>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-beach-600 mb-2">Resort/Hotel</div>
                  <p className="text-gray-600 mb-4">500+ daily guests</p>
                  <div className="text-2xl font-bold text-green-600">$2,500-4,000</div>
                  <p className="text-sm text-gray-500">Monthly revenue potential</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-beach-600 mb-2">Public Pool</div>
                  <p className="text-gray-600 mb-4">200-300 daily visitors</p>
                  <div className="text-2xl font-bold text-green-600">$800-1,500</div>
                  <p className="text-sm text-gray-500">Monthly revenue potential</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-beach-600 mb-2">Small Hotel</div>
                  <p className="text-gray-600 mb-4">100-200 daily guests</p>
                  <div className="text-2xl font-bold text-green-600">$600-1,200</div>
                  <p className="text-sm text-gray-500">Monthly revenue potential</p>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                *Based on average 3-5% purchase rate and 25% revenue share model
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-beach-50">
        <CTASimple
          title="Ready to Join Our Success Stories?"
          description="Schedule a consultation to see how Beach Box can generate revenue for your venue."
          variant="default"
          primaryCta={{
            text: "Schedule Your Consultation",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "Download Case Study Report",
            href: "#"
          }}
        />
      </section>
    </div>
  )
}