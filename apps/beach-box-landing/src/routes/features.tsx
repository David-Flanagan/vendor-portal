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
  Zap
} from 'lucide-react'

export const Route = createFileRoute('/features')({
  component: WhyBeachBox,
})

function WhyBeachBox() {
  const bentoItems = [
    {
      title: "Fully Insured Operations",
      description: "$1M liability coverage with your venue as additional insured",
      icon: Shield,
      className: "md:col-span-2",
      content: (
        <div className="mt-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">General liability coverage</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Product liability protection</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm">Property damage coverage</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Zero Staff Involvement",
      description: "Remote monitoring and maintenance",
      icon: Zap,
    },
    {
      title: "Professional Installation",
      description: "We handle permits and setup",
      icon: Wrench,
    },
    {
      title: "Monthly Revenue Reports",
      description: "Transparent accounting and payments",
      icon: BarChart,
    }
  ]

  return (
    <div className="flex flex-col pt-20">
      {/* Hero Section */}
      <section className="pb-20">
        <HeroCentered
          announcement={undefined}
          backgroundImage={undefined}
          description="The complete turnkey solution that generates revenue while enhancing guest experience—with zero effort from your team."
          primaryCta={{
            text: "Schedule Consultation",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "View Case Studies",
            href: "/case-studies"
          }}
          socialProof={undefined}
          title="Why Venue Operators Choose Beach Box"
        />
      </section>

      {/* Main Benefits */}
      <section className="py-20 bg-gray-50">
        <FeaturesAlternating
          description="We take care of every aspect so you can focus on running your venue"
          features={[
            {
              badge: "Revenue Generation",
              description: "Generate consistent monthly revenue with zero effort. Our revenue-sharing model means you earn money while we do all the work.",
              highlights: [
                "15-35% commission on all sales",
                "Average $1,500-4,000 monthly revenue",
                "Transparent monthly reporting",
                "Guaranteed payment schedule"
              ],
              icon: DollarSign,
              image: {
                alt: "Monthly revenue reports",
                src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop"
              },
              title: "Passive Income Stream"
            },
            {
              badge: "Guest Experience",
              description: "Provide a valuable amenity that guests actually want and use, leading to better reviews and repeat visits.",
              highlights: [
                "95% of partners report improved satisfaction",
                "Reduces guest complaints about sunscreen",
                "Positive mentions in online reviews",
                "Encourages longer stays at venue"
              ],
              icon: Users,
              image: {
                alt: "Happy hotel guests by pool",
                src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop"
              },
              title: "Enhanced Guest Satisfaction"
            },
            {
              badge: "Operations",
              description: "We handle everything from installation to daily operations. Your staff never needs to touch the machine.",
              highlights: [
                "Remote inventory monitoring",
                "Automatic restocking service",
                "24/7 technical support",
                "Regular maintenance included"
              ],
              icon: Clock,
              image: {
                alt: "Beach Box technician servicing machine",
                src: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
              },
              title: "Zero Operational Burden"
            },
            {
              badge: "Risk Management",
              description: "Full insurance coverage protects your venue with comprehensive liability policies and safety standards.",
              highlights: [
                "$1M general liability coverage",
                "Your venue as additional insured",
                "Product liability protection",
                "Professional installation standards"
              ],
              icon: Shield,
              image: {
                alt: "Insurance documents and protection",
                src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop"
              },
              title: "Complete Liability Protection"
            }
          ]}
          title="Everything Handled for You"
        />
      </section>

      {/* Key Differentiators */}
      <section className="py-20">
        <BentoGrid
          className=""
          description="The advantages that make us the preferred partner for venue operators"
          items={bentoItems}
          title="What Sets Beach Box Apart"
        />
      </section>

      {/* Comparison with Alternatives */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Beach Box vs. Other Options</h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              See why venue operators prefer our approach
            </p>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left">Solution</th>
                    <th className="px-6 py-4 text-center">Upfront Cost</th>
                    <th className="px-6 py-4 text-center">Staff Time</th>
                    <th className="px-6 py-4 text-center">Revenue Potential</th>
                    <th className="px-6 py-4 text-center">Liability Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-beach-50">
                    <td className="px-6 py-4 font-medium">Beach Box Partnership</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">$0</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">0 hours</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">High</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">Covered</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Free Sunscreen Station</td>
                    <td className="px-6 py-4 text-center text-red-600">$2,000-5,000</td>
                    <td className="px-6 py-4 text-center text-red-600">20+ hours/month</td>
                    <td className="px-6 py-4 text-center text-red-600">None</td>
                    <td className="px-6 py-4 text-center text-red-600">Your responsibility</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Gift Shop Sales</td>
                    <td className="px-6 py-4 text-center text-orange-600">$500-1,500</td>
                    <td className="px-6 py-4 text-center text-orange-600">10+ hours/month</td>
                    <td className="px-6 py-4 text-center text-orange-600">Low-Medium</td>
                    <td className="px-6 py-4 text-center text-orange-600">Your responsibility</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">No Solution</td>
                    <td className="px-6 py-4 text-center text-green-600">$0</td>
                    <td className="px-6 py-4 text-center text-green-600">0 hours</td>
                    <td className="px-6 py-4 text-center text-red-600">None</td>
                    <td className="px-6 py-4 text-center text-red-600">Guest complaints</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Seamless Installation Process</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-beach-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold mb-2">Site Assessment</h3>
                    <p className="text-gray-600">
                      Our team visits to determine optimal placement, electrical requirements, and partnership terms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-beach-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold mb-2">Permits & Approvals</h3>
                    <p className="text-gray-600">
                      We handle all necessary permits, approvals, and regulatory requirements at no cost to you.
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
                      Certified technicians install and configure the machine, including electrical connections and testing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-beach-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold mb-2">Go Live & Monitor</h3>
                    <p className="text-gray-600">
                      Machine is activated, stocked, and begins generating revenue. Remote monitoring ensures optimal performance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-6">Installation Guarantees</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">7-10 business days from approval</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Zero cost to venue</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Minimal disruption to operations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Professional certification & licensing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">30-day trial period</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-ocean-50">
        <CTASimple
          description="Join 50+ successful venue partners who are generating passive income while enhancing guest satisfaction."
          primaryCta={{
            text: "Schedule Your Site Assessment",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "View Success Stories",
            href: "/case-studies"
          }}
          title="Experience the Beach Box Advantage"
          variant="default"
        />
      </section>
    </div>
  )
}