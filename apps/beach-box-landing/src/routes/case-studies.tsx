import { createFileRoute } from '@tanstack/react-router'
import { HeroCentered, StatsSimple, CTASimple } from '@beach-box/unify-ui'
import { TrendingUp, Users, DollarSign, Star, MapPin, Building, Hotel, TreePine, Anchor } from 'lucide-react'

export const Route = createFileRoute('/case-studies')({
  component: CaseStudies,
})

interface CaseStudy {
  id: string
  name: string
  type: 'resort' | 'hotel' | 'government' | 'pool' | 'marina' | 'waterpark'
  location: string
  partnership: 'revenue-share' | 'rental' | 'lease'
  monthlyRevenue: string
  guestSatisfaction: string
  installDate: string
  quote: string
  manager: string
  title: string
  icon: React.ComponentType<any>
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
            monthlyRevenue: '$1,200',
    guestSatisfaction: '18% increase',
    installDate: 'March 2024',
    icon: Hotel,
    quote: "Beach Box has been a game-changer for our resort operations. Our guests love the convenience, and we're earning significant passive income. The installation was seamless and their support team is outstanding.",
    manager: 'Jennifer Martinez',
    title: 'General Manager',
    results: [
      {
        before: 'Frequent guest complaints about sunscreen availability',
        after: 'Zero sunscreen-related complaints, improved TripAdvisor ratings',
        improvement: '18% guest satisfaction increase'
      },
      {
        before: 'No revenue streams from pool deck amenities',
        after: 'Consistent monthly passive income from sunscreen sales',
        improvement: '$1,200 average monthly revenue'
      },
      {
        before: 'Staff time spent handling sunscreen requests',
        after: 'Zero staff involvement with sunscreen amenity',
        improvement: '12 hours/week staff time savings'
      }
    ]
  },
  {
    id: '2',
    name: 'City of Clearwater Parks Department',
    type: 'government',
    location: 'Clearwater, FL',
    partnership: 'rental',
    monthlyRevenue: '$800',
    guestSatisfaction: '22% increase',
    installDate: 'January 2024',
    icon: TreePine,
    quote: "As a public facility, we needed a solution that was both beneficial for residents and fiscally responsible. Beach Box's rental model provides guaranteed income while serving our community's sun safety needs perfectly.",
    manager: 'Robert Chen',
    title: 'Parks Director',
    results: [
      {
        before: 'Budget constraints limited free sunscreen program',
        after: 'Self-funding sun safety amenity with guaranteed income',
        improvement: '$800 monthly revenue to parks budget'
      },
      {
        before: 'Resident complaints about high sunscreen costs at beach',
        after: 'Convenient, affordable on-site sunscreen access',
        improvement: '22% resident satisfaction increase'
      },
      {
        before: 'Maintenance burden on already stretched staff',
        after: 'Zero maintenance responsibilities for park employees',
        improvement: 'Fully outsourced service management'
      }
    ]
  },
  {
    id: '3',
    name: 'Sunset Marina & Resort',
    type: 'marina',
    location: 'Key West, FL',
    partnership: 'lease',
            monthlyRevenue: '$2,200',
    guestSatisfaction: '15% increase',
    installDate: 'February 2024',
    icon: Anchor,
    quote: "With our large marina operation, the lease model made perfect sense. We keep all the revenue and have full control over pricing and inventory. Beach Box's support team made the transition incredibly smooth.",
    manager: 'Michael Torres',
    title: 'Marina Operations Manager',
    results: [
      {
        before: 'High markup complaints about marina store sunscreen',
        after: 'Competitive dockside pricing with convenient access',
        improvement: '15% customer satisfaction increase'
      },
      {
        before: 'Limited revenue from dock amenities',
        after: 'Significant new revenue stream from boater traffic',
        improvement: '$2,200 average monthly revenue'
      },
      {
        before: 'Seasonal sunscreen inventory management challenges',
        after: 'Predictable demand patterns and automated supply',
        improvement: 'Streamlined inventory operations'
      }
    ]
  },
  {
    id: '4',
    name: 'Splash World Water Park',
    type: 'waterpark',
    location: 'Orlando, FL',
    partnership: 'revenue-share',
            monthlyRevenue: '$1,500',
    guestSatisfaction: '25% increase',
    installDate: 'April 2024',
    icon: Users,
    quote: "Our guests were constantly asking about sunscreen, especially families with kids. Beach Box solved this problem beautifully. The revenue sharing model means we earn money while keeping our guests happy and protected.",
    manager: 'Sarah Williams',
    title: 'Guest Services Manager',
    results: [
      {
        before: 'Long lines at gift shop for sunscreen during peak times',
        after: 'Multiple convenient locations throughout the park',
        improvement: '25% guest satisfaction boost'
      },
      {
        before: 'Staff constantly directing guests to sunscreen locations',
        after: 'Self-service access reduces staff workload',
        improvement: 'Improved staff efficiency'
      },
      {
        before: 'Missed revenue opportunities from guest traffic',
        after: 'Strategic placement captures high-traffic areas',
        improvement: '$1,500 monthly revenue'
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
          announcement={{
            text: "50+ Successful Partnerships Across Florida"
          }}
          backgroundImage={undefined}
          description="See how Beach Box partnerships are generating revenue and improving guest satisfaction for hotels, resorts, government facilities, and recreational venues across Florida."
          primaryCta={{
            text: "Schedule Your Venue Consultation",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "View Partnership Models",
            href: "/partnership-models"
          }}
          socialProof={undefined}
          title="Proven Results from Venue Partners"
        />
      </section>

      {/* Overall Partnership Stats */}
      <section className="py-20 bg-gray-50">
        <StatsSimple
          columns={4}
          description="Aggregate results from our venue partner network"
          stats={[
            {
              icon: DollarSign,
              value: "$125K",
              suffix: "+",
              label: "Total Partner Revenue Generated",
              description: "Earned by venue partners in 2024"
            },
            {
              icon: TrendingUp,
              value: "18",
              suffix: "%",
              label: "Average Guest Satisfaction Increase",
              description: "Reported across all partner venues"
            },
            {
              icon: Users,
              value: "95",
              suffix: "%",
              label: "Partner Retention Rate",
              description: "Year-over-year partnership renewals"
            },
            {
              icon: Star,
              value: "4.9",
              suffix: "/5",
              label: "Partner Satisfaction Rating",
              description: "From quarterly partner surveys"
            }
          ]}
          title="Partnership Success Metrics"
        />
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Venue Partner Success Stories</h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Real results from hotels, resorts, government facilities, and recreational venues
            </p>

            <div className="space-y-16">
              {caseStudies.map((study) => (
                <div key={study.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left side - Venue Info */}
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-beach-100 rounded-full flex items-center justify-center">
                          <study.icon className="h-6 w-6 text-beach-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{study.name}</h3>
                          <p className="text-gray-600 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {study.location}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            {study.type.replace('_', ' ')} • {study.partnership.replace('-', ' ')} model
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
                          <p className="text-sm text-gray-600">Satisfaction Improvement</p>
                        </div>
                      </div>

                      <blockquote className="text-lg italic text-gray-700 mb-6 border-l-4 border-beach-500 pl-4">
                        "{study.quote}"
                      </blockquote>

                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-beach-400 to-ocean-500 rounded-full mr-4 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {study.manager.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{study.manager}</p>
                          <p className="text-sm text-gray-600">{study.title}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Results & Impact */}
                    <div className="bg-gray-50 p-8">
                      <h4 className="text-xl font-semibold mb-6">Business Impact & Results</h4>
                      <div className="space-y-6">
                        {study.results.map((result, index) => (
                          <div key={index} className="border-l-4 border-beach-500 pl-4">
                            <div className="mb-2">
                              <span className="text-sm font-medium text-red-600">Challenge:</span>
                              <p className="text-sm text-gray-700">{result.before}</p>
                            </div>
                            <div className="mb-2">
                              <span className="text-sm font-medium text-green-600">Solution:</span>
                              <p className="text-sm text-gray-700">{result.after}</p>
                            </div>
                            <div className="bg-beach-100 px-3 py-1 rounded-full inline-block">
                              <span className="text-sm font-medium text-beach-700">{result.improvement}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Partnership Model:</span>
                          <span className="font-medium capitalize">{study.partnership.replace('-', ' ')}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Installation Date:</span>
                          <span className="font-medium">{study.installDate}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Venue Type:</span>
                          <span className="font-medium capitalize">{study.type}</span>
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

      {/* ROI Calculator by Venue Type */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Revenue Potential by Venue Type</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Based on real performance data from our partner venues
            </p>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <Hotel className="h-8 w-8 text-beach-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-beach-600 mb-1">Resort/Hotel</div>
                  <p className="text-gray-600 mb-3 text-sm">500+ daily guests</p>
                  <div className="text-2xl font-bold text-green-600">$2,500-4,000</div>
                  <p className="text-xs text-gray-500">Monthly revenue potential</p>
                </div>
                <div className="text-center">
                  <TreePine className="h-8 w-8 text-ocean-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-ocean-600 mb-1">Government Pool</div>
                  <p className="text-gray-600 mb-3 text-sm">200-300 daily visitors</p>
                  <div className="text-2xl font-bold text-green-600">$800-1,500</div>
                  <p className="text-xs text-gray-500">Monthly revenue potential</p>
                </div>
                <div className="text-center">
                  <Anchor className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-purple-600 mb-1">Marina/Dock</div>
                  <p className="text-gray-600 mb-3 text-sm">High-traffic boating</p>
                  <div className="text-2xl font-bold text-green-600">$1,500-3,000</div>
                  <p className="text-xs text-gray-500">Monthly revenue potential</p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-blue-600 mb-1">Water Park</div>
                  <p className="text-gray-600 mb-3 text-sm">High-volume families</p>
                  <div className="text-2xl font-bold text-green-600">$3,000-6,000</div>
                  <p className="text-xs text-gray-500">Monthly revenue potential</p>
                </div>
              </div>
              <div className="mt-6 text-sm text-gray-500">
                *Revenue estimates based on average 3-5% guest purchase rate and 25% revenue share model
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Types We Serve */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Venue Types We Partner With</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Hotel, label: "Hotels & Resorts", desc: "Poolside & beachfront locations" },
                { icon: TreePine, label: "Government Facilities", desc: "Public pools & recreation centers" },
                { icon: Anchor, label: "Marinas & Docks", desc: "Boat launches & waterfront venues" },
                { icon: Users, label: "Water Parks", desc: "Theme parks & family attractions" },
                { icon: Building, label: "Community Centers", desc: "HOA pools & private clubs" },
                { icon: Star, label: "Golf Courses", desc: "Country clubs & public courses" },
                { icon: MapPin, label: "Beach Access Points", desc: "Public beaches & boardwalks" },
                { icon: DollarSign, label: "Event Venues", desc: "Outdoor festivals & venues" }
              ].map((venue, index) => (
                <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm border">
                  <venue.icon className="h-8 w-8 text-beach-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-sm mb-1">{venue.label}</h3>
                  <p className="text-xs text-gray-600">{venue.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-beach-50">
        <CTASimple
          description="Schedule a consultation to see how Beach Box can generate revenue for your venue while enhancing guest satisfaction."
          primaryCta={{
            text: "Schedule Your Venue Consultation",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "Download Detailed Case Study Report",
            href: "#"
          }}
          title="Ready to Join Our Success Stories?"
          variant="default"
        />
      </section>
    </div>
  )
}