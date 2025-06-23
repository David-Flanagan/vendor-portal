import { createFileRoute } from '@tanstack/react-router'
import {
  HeroCentered,
  FeaturesAlternating,
  BentoGrid,
  CTASimple
} from '@beach-box/unify-ui'
import {
  Shield,
  DollarSign,
  Clock,
  Users,
  BarChart,
  Wrench,
  CheckCircle,
  Zap,
  TrendingUp
} from 'lucide-react'

export const Route = createFileRoute('/why-beach-box')({
  component: WhyBeachBox,
})

function WhyBeachBox() {
  const bentoItems = [
    {
      title: "Complete Liability Protection",
      description: "$1M coverage with your venue as additional insured",
      icon: Shield,
      className: "md:col-span-2",
      content: (
        <div className="mt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">General liability coverage included</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Product liability protection</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Property damage coverage</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Professional installation standards</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Zero Operational Burden",
      description: "Remote monitoring eliminates staff involvement",
      icon: Zap,
    },
    {
      title: "Professional Installation",
      description: "We handle all permits, compliance & setup",
      icon: Wrench,
    },
    {
      title: "Transparent Reporting",
      description: "Monthly statements and performance analytics",
      icon: BarChart,
    }
  ]

  return (
    <div className="flex flex-col pt-20">
      {/* Hero Section */}
      <section className="pb-20">
        <HeroCentered
          announcement={{
            text: "95% of venue partners renew their partnerships year-over-year"
          }}
          backgroundImage={undefined}
          description="The complete turnkey solution that generates revenue while enhancing guest experience—with zero effort from your venue team."
          primaryCta={{
            text: "Schedule Partnership Consultation",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "View Partnership Success Stories",
            href: "/case-studies"
          }}
          socialProof={undefined}
          title="Why Venue Operators Choose Beach Box Over Alternatives"
        />
      </section>

      {/* Main Business Benefits */}
      <section className="py-20 bg-gray-50">
        <FeaturesAlternating
          description="We deliver all the benefits venue operators need while eliminating the typical operational hassles"
          features={[
            {
              badge: "Revenue Generation",
              description: "Generate consistent passive income with zero investment or effort from your venue. Our revenue-sharing model means you earn money while we handle everything.",
              highlights: [
                "15-35% commission on all sales with transparent reporting",
                "Average partner venues earn $400-1,200 monthly",
                "Guaranteed monthly payments with detailed accounting",
                "No upfront costs or ongoing operational expenses"
              ],
              icon: DollarSign,
              image: {
                alt: "Monthly revenue reports and income statements",
                src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop"
              },
              title: "Passive Income Without Investment"
            },
            {
              badge: "Guest Experience",
              description: "Provide a valuable amenity that guests actually want and use, leading to higher satisfaction scores and positive reviews.",
              highlights: [
                "95% of partner venues report improved guest satisfaction",
                "Reduces complaints about sunscreen availability",
                "Positive mentions in TripAdvisor and Google reviews",
                "Encourages longer stays and repeat visits"
              ],
              icon: Users,
              image: {
                alt: "Happy families at hotel pool using sunscreen",
                src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop"
              },
              title: "Enhanced Guest Satisfaction"
            },
            {
              badge: "Operations",
              description: "We handle every aspect of the sunscreen vending service so your staff can focus on core venue operations without any additional workload.",
              highlights: [
                "Remote inventory monitoring and automatic alerts",
                "Scheduled restocking service with no venue coordination needed",
                "24/7 technical support and immediate issue resolution",
                "Regular maintenance included with professional service standards"
              ],
              icon: Clock,
              image: {
                alt: "Beach Box technician professionally servicing machine",
                src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
              },
              title: "Complete Hands-Off Operation"
            },
            {
              badge: "Risk Management",
              description: "Comprehensive insurance coverage and professional standards protect your venue while ensuring regulatory compliance.",
              highlights: [
                "$1M general liability with venue as additional insured",
                "Full product liability and property damage protection",
                "Professional installation meeting all safety codes",
                "Ongoing compliance with local regulations and permits"
              ],
              icon: Shield,
              image: {
                alt: "Professional installation and safety compliance documentation",
                src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop"
              },
              title: "Complete Risk Protection"
            }
          ]}
          title="Four Key Benefits for Venue Operators"
        />
      </section>

      {/* Key Differentiators */}
      <section className="py-20">
        <BentoGrid
          className=""
          description="The operational advantages that make us the preferred partner for venue operators"
          items={bentoItems}
          title="What Sets Beach Box Apart from Alternatives"
        />
      </section>

      {/* Comparison with Alternatives */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Beach Box vs. Other Sunscreen Solutions</h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              See why venue operators prefer our partnership approach
            </p>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left">Solution Option</th>
                    <th className="px-6 py-4 text-center">Upfront Investment</th>
                    <th className="px-6 py-4 text-center">Staff Time Required</th>
                    <th className="px-6 py-4 text-center">Revenue Potential</th>
                    <th className="px-6 py-4 text-center">Liability Risk</th>
                    <th className="px-6 py-4 text-center">Guest Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-beach-50">
                    <td className="px-6 py-4 font-medium">Beach Box Partnership</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">$0</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">0 hours</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">$400-1,200/month</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">Fully Covered</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">High Satisfaction</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Free Sunscreen Dispensers</td>
                    <td className="px-6 py-4 text-center text-red-600">$2,000-5,000</td>
                    <td className="px-6 py-4 text-center text-red-600">20+ hours/month</td>
                    <td className="px-6 py-4 text-center text-red-600">$0 (Cost Only)</td>
                    <td className="px-6 py-4 text-center text-red-600">Your Responsibility</td>
                    <td className="px-6 py-4 text-center text-orange-600">Medium</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Gift Shop/Retail Sales</td>
                    <td className="px-6 py-4 text-center text-orange-600">$500-1,500</td>
                    <td className="px-6 py-4 text-center text-orange-600">10+ hours/month</td>
                    <td className="px-6 py-4 text-center text-orange-600">Low-Medium</td>
                    <td className="px-6 py-4 text-center text-orange-600">Your Responsibility</td>
                    <td className="px-6 py-4 text-center text-orange-600">Medium</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">No Sunscreen Solution</td>
                    <td className="px-6 py-4 text-center text-green-600">$0</td>
                    <td className="px-6 py-4 text-center text-green-600">0 hours</td>
                    <td className="px-6 py-4 text-center text-red-600">$0</td>
                    <td className="px-6 py-4 text-center text-red-600">Guest Complaints</td>
                    <td className="px-6 py-4 text-center text-red-600">Poor (Sunburned Guests)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                * Based on survey data from 50+ venue partners and industry research
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation & Partnership Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Seamless Partnership Process</h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              From initial contact to revenue generation in 7-10 business days
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-beach-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold mb-2">Partnership Application</h3>
                    <p className="text-gray-600">
                      Submit your venue details through our streamlined application. We evaluate location, guest traffic, and partnership fit within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-beach-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold mb-2">Site Assessment & Terms</h3>
                    <p className="text-gray-600">
                      Our partnership team visits to determine optimal placement, assess electrical requirements, and finalize revenue terms that work for your venue.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-beach-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold mb-2">Professional Installation</h3>
                    <p className="text-gray-600">
                      We handle all permits, regulatory approvals, and professional installation. Certified technicians ensure code compliance and optimal setup.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-beach-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold mb-2">Revenue Generation Begins</h3>
                    <p className="text-gray-600">
                      Machine goes live, starts generating revenue immediately. Remote monitoring ensures optimal performance while you earn passive income monthly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-6">Partnership Guarantees</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">7-10 business days from approval to operation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Zero upfront investment from venue</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Minimal disruption to venue operations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Professional installation & certification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">30-day trial period with flexible terms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">24/7 support and technical assistance</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-3">Why Venue Operators Love Beach Box:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• "Finally, an amenity that pays for itself" - Resort GM</p>
                    <p>• "Zero headaches, just monthly revenue" - Parks Director</p>
                    <p>• "Guests always mention it in positive reviews" - Hotel Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI & Performance Metrics */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Partnership Performance Metrics</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Real data from our venue partner network
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <p className="text-sm text-gray-600 mb-1">Partner Retention Rate</p>
                <p className="text-xs text-gray-500">Year-over-year renewals</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <DollarSign className="h-8 w-8 text-beach-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-beach-600 mb-2">$800</div>
                <p className="text-sm text-gray-600 mb-1">Average Monthly Revenue</p>
                <p className="text-xs text-gray-500">Per partner venue</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-blue-600 mb-2">18%</div>
                <p className="text-sm text-gray-600 mb-1">Guest Satisfaction Increase</p>
                <p className="text-xs text-gray-500">Average across all venues</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
                <p className="text-sm text-gray-600 mb-1">Hours Staff Time Required</p>
                <p className="text-xs text-gray-500">Per month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-ocean-50">
        <CTASimple
          description="Join 50+ successful venue partners across Florida who are generating passive income while enhancing guest satisfaction and reducing operational burden."
          primaryCta={{
            text: "Schedule Your Partnership Assessment",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "View Partnership Success Stories",
            href: "/case-studies"
          }}
          title="Experience the Beach Box Advantage for Your Venue"
          variant="default"
        />
      </section>
    </div>
  )
}