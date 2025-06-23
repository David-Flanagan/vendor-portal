import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { HeroCentered, FeaturesGrid, CTASimple } from '@beach-box/unify-ui'
import { DollarSign, Shield, Clock, Users, BarChart, Wrench } from 'lucide-react'

export const Route = createFileRoute('/partnership-models')({
  component: PartnershipModels,
})

function PartnershipModels() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col pt-20">
      {/* Hero Section */}
      <section className="pb-20">
        <HeroCentered
          title="Partnership Models That Work for Your Venue"
          description="Choose the revenue model that best fits your property type and operational preferences. All models include full service, liability coverage, and professional support."
          announcement={{
            text: "Most Popular: Revenue Share Model - Zero Risk, Immediate Income"
          }}
          primaryCta={{
            text: "Schedule Partnership Consultation",
            onClick: () => navigate({ to: '/contact', search: { subject: undefined, model: undefined } })
          }}
          secondaryCta={{
            text: "Download Partnership Guide",
            href: "mailto:partnerships@beachboxflorida.com?subject=Partnership Guide Request"
          }}
          socialProof={undefined}
          backgroundImage={undefined}
        />
      </section>

      {/* Partnership Models */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Three Partnership Models for Venues</h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Designed for hotels, resorts, government facilities, and recreational venues
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Revenue Share Model */}
              <div className="bg-white rounded-lg shadow-lg p-8 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-beach-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                </div>
                <div className="text-center mb-6">
                  <DollarSign className="h-12 w-12 text-beach-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Revenue Share</h3>
                  <p className="text-gray-600">Perfect for hotels, resorts & recreational venues</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Zero upfront investment from venue</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Venue earns 15-35% commission on all sales</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">We handle installation, maintenance, restocking</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Monthly revenue reports & guaranteed payments</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">30-day cancellation - no long-term commitment</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">$400-1,200</div>
                  <p className="text-sm text-gray-500 mb-4">Average monthly venue revenue</p>
                  <button
                    onClick={() => navigate({ to: '/contact', search: { subject: undefined, model: 'revenue-share' } })}
                    className="w-full bg-beach-500 text-white py-2 rounded-lg hover:bg-beach-600 transition-colors"
                  >
                    Apply for Revenue Share
                  </button>
                </div>
              </div>

              {/* Flat Monthly Rental */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <BarChart className="h-12 w-12 text-ocean-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Monthly Rental</h3>
                  <p className="text-gray-600">Ideal for government facilities & public venues</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Guaranteed monthly payment to venue</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">No sales performance risk</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Predictable budgeting for facility managers</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Compliant with government procurement rules</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">12-month standard agreement</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">$200-500</div>
                  <p className="text-sm text-gray-500 mb-4">Guaranteed monthly rental income</p>
                  <button
                    onClick={() => navigate({ to: '/contact', search: { subject: undefined, model: 'rental' } })}
                    className="w-full bg-ocean-500 text-white py-2 rounded-lg hover:bg-ocean-600 transition-colors"
                  >
                    Apply for Monthly Rental
                  </button>
                </div>
              </div>

              {/* Machine Leasing */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <Wrench className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Machine Lease</h3>
                  <p className="text-gray-600">Best for large resorts with retail operations</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Venue keeps 100% of sales revenue</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Full control over pricing & inventory</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Integrate with existing retail operations</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">24/7 technical support included</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Staff training & setup included</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">$299</div>
                  <p className="text-sm text-gray-500 mb-4">Monthly lease fee</p>
                  <button
                    onClick={() => navigate({ to: '/contact', search: { subject: undefined, model: 'lease' } })}
                    className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Apply for Machine Lease
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20">
        <FeaturesGrid
          title="What Every Venue Partner Receives"
          description="Comprehensive support regardless of partnership model"
          columns={3}
          features={[
            {
              icon: Shield,
              title: "$1M Liability Protection",
              description: "Your venue is named as additional insured on our comprehensive policy. Full coverage for property damage, product liability, and general liability."
            },
            {
              icon: Wrench,
              title: "Professional Installation",
              description: "We handle all permits, electrical connections, and regulatory compliance. Minimal disruption to your venue operations."
            },
            {
              icon: Clock,
              title: "24/7 Monitoring & Support",
              description: "Real-time inventory tracking, automatic alerts, and immediate technical support. Your staff never needs to touch the machine."
            },
            {
              icon: Users,
              title: "Guest Relations Support",
              description: "Direct customer service line for any guest issues. We handle all product-related inquiries and complaints."
            },
            {
              icon: BarChart,
              title: "Transparent Reporting",
              description: "Detailed monthly sales reports, revenue statements, and performance analytics. Track your venue's earnings and guest usage."
            },
            {
              icon: DollarSign,
              title: "Flexible Partnership Terms",
              description: "No long-term commitments required. Adjust partnership terms or cancel with 30 days notice as your venue needs change."
            }
          ]}
        />
      </section>

      {/* Venue Type Recommendations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Which Model Is Right for Your Venue?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-beach-600">Hotels & Resorts</h3>
                <p className="text-gray-600 mb-4">Revenue Share or Machine Lease models work best</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• High guest volume = higher revenue potential</li>
                  <li>• Revenue share removes all risk</li>
                  <li>• Machine lease gives full control for large operations</li>
                  <li>• Enhances guest satisfaction scores</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-ocean-600">Government Facilities</h3>
                <p className="text-gray-600 mb-4">Monthly Rental model is typically preferred</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Predictable budget line item</li>
                  <li>• No revenue sharing complications</li>
                  <li>• Meets procurement requirements</li>
                  <li>• Serves public safety mission</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-purple-600">Large Resort Chains</h3>
                <p className="text-gray-600 mb-4">Machine Lease gives maximum control and profit</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Integrate with existing retail operations</li>
                  <li>• Set pricing to match venue standards</li>
                  <li>• Higher profit margins on volume</li>
                  <li>• Staff training and support included</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Partnership Model Comparison</h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left">Venue Consideration</th>
                    <th className="px-6 py-4 text-center">Revenue Share</th>
                    <th className="px-6 py-4 text-center">Monthly Rental</th>
                    <th className="px-6 py-4 text-center">Machine Lease</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium">Upfront Investment</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">$0</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">$0</td>
                    <td className="px-6 py-4 text-center">$299/month</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Revenue Potential</td>
                    <td className="px-6 py-4 text-center">15-35% of sales</td>
                    <td className="px-6 py-4 text-center">Fixed monthly fee</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">100% of sales</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Operational Burden</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">Zero</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">Zero</td>
                    <td className="px-6 py-4 text-center">Light (inventory only)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Performance Risk</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">We assume</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">None</td>
                    <td className="px-6 py-4 text-center">Venue assumes</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Best Venue Type</td>
                    <td className="px-6 py-4 text-center">Hotels, Pools, Parks</td>
                    <td className="px-6 py-4 text-center">Government, Public</td>
                    <td className="px-6 py-4 text-center">Large Resorts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-beach-50">
        <CTASimple
          title="Ready to Choose Your Partnership Model?"
          description="Schedule a consultation with our venue partnership team to determine the best model for your property and discuss next steps."
          variant="default"
          primaryCta={{
            text: "Schedule Partnership Consultation",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "Download Partnership Comparison Guide",
            href: "#"
          }}
        />
      </section>
    </div>
  )
}