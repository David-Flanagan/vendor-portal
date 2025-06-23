import { createFileRoute } from '@tanstack/react-router'
import { HeroCentered, FeaturesGrid, CTASimple } from '@beach-box/unify-ui'
import { DollarSign, Shield, Clock, Users, BarChart, Wrench } from 'lucide-react'

export const Route = createFileRoute('/pricing')({
  component: PartnershipModels,
})

function PartnershipModels() {
  return (
    <div className="flex flex-col pt-20">
      {/* Hero Section */}
      <section className="pb-20">
        <HeroCentered
          title="Flexible Partnership Models"
          description="Choose the partnership structure that works best for your venue. All models include full service and support."
          announcement={undefined}
          primaryCta={{
            text: "Schedule a Consultation",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "Download Info Pack",
            href: "#"
          }}
          socialProof={undefined}
          backgroundImage={undefined}
        />
      </section>

      {/* Partnership Models */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Three Partnership Options</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Revenue Share Model */}
              <div className="bg-white rounded-lg shadow-lg p-8 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-beach-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                </div>
                <div className="text-center mb-6">
                  <DollarSign className="h-12 w-12 text-beach-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Revenue Share</h3>
                  <p className="text-gray-600">Zero upfront costs, we split the profits</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">No upfront investment required</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Earn 15-35% commission on all sales</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">We handle installation, maintenance & restocking</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Monthly revenue reports & payments</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">30-day cancellation notice</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">$400-1,200</div>
                  <p className="text-sm text-gray-500 mb-4">Average monthly revenue</p>
                  <button className="w-full bg-beach-500 text-white py-2 rounded-lg hover:bg-beach-600 transition-colors">
                    Apply for Revenue Share
                  </button>
                </div>
              </div>

              {/* Flat Monthly Rental */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <BarChart className="h-12 w-12 text-ocean-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Monthly Rental</h3>
                  <p className="text-gray-600">Guaranteed income, we keep the sales</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Guaranteed monthly payment</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">No sales risk - fixed income</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">We handle all operations</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Perfect for government facilities</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">12-month minimum commitment</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">$200-500</div>
                  <p className="text-sm text-gray-500 mb-4">Guaranteed monthly rent</p>
                  <button className="w-full bg-ocean-500 text-white py-2 rounded-lg hover:bg-ocean-600 transition-colors">
                    Apply for Monthly Rental
                  </button>
                </div>
              </div>

              {/* Machine Leasing */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-6">
                  <Wrench className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Machine Lease</h3>
                  <p className="text-gray-600">You operate, keep all profits</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Keep 100% of sales revenue</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">You manage inventory & pricing</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">We provide technical support</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Best for large resort operations</span>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-sm">Training & setup included</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">$299</div>
                  <p className="text-sm text-gray-500 mb-4">Monthly lease fee</p>
                  <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors">
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
          title="What's Included in Every Partnership"
          description="Regardless of your chosen model, you get full support"
          columns={3}
          features={[
            {
              icon: Shield,
              title: "$1M Liability Coverage",
              description: "Your venue is named as additional insured on our comprehensive policy."
            },
            {
              icon: Wrench,
              title: "Professional Installation",
              description: "We handle permits, electrical connections, and setup at no charge."
            },
            {
              icon: Clock,
              title: "24/7 Remote Monitoring",
              description: "Real-time inventory tracking and immediate alerts for any issues."
            },
            {
              icon: Users,
              title: "Guest Support",
              description: "Direct customer service line for any guest issues or questions."
            },
            {
              icon: BarChart,
              title: "Monthly Reporting",
              description: "Detailed sales reports and transparent accounting for your records."
            },
            {
              icon: DollarSign,
              title: "Flexible Terms",
              description: "No long-term commitments required. Adjust or cancel with 30 days notice."
            }
          ]}
        />
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Partnership Model Comparison</h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left">Feature</th>
                    <th className="px-6 py-4 text-center">Revenue Share</th>
                    <th className="px-6 py-4 text-center">Monthly Rental</th>
                    <th className="px-6 py-4 text-center">Machine Lease</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium">Upfront Cost</td>
                    <td className="px-6 py-4 text-center text-green-600">$0</td>
                    <td className="px-6 py-4 text-center text-green-600">$0</td>
                    <td className="px-6 py-4 text-center">$299/month</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Revenue Potential</td>
                    <td className="px-6 py-4 text-center">15-35% of sales</td>
                    <td className="px-6 py-4 text-center">Fixed monthly</td>
                    <td className="px-6 py-4 text-center text-green-600">100% of sales</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Maintenance</td>
                    <td className="px-6 py-4 text-center text-green-600">We handle</td>
                    <td className="px-6 py-4 text-center text-green-600">We handle</td>
                    <td className="px-6 py-4 text-center">You handle</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Inventory Risk</td>
                    <td className="px-6 py-4 text-center text-green-600">We assume</td>
                    <td className="px-6 py-4 text-center text-green-600">We assume</td>
                    <td className="px-6 py-4 text-center">You assume</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Best For</td>
                    <td className="px-6 py-4 text-center">Most venues</td>
                    <td className="px-6 py-4 text-center">Government sites</td>
                    <td className="px-6 py-4 text-center">Large resorts</td>
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
          description="Schedule a consultation to discuss which model works best for your venue."
          variant="default"
          primaryCta={{
            text: "Schedule Consultation",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "Download Comparison Guide",
            href: "#"
          }}
        />
      </section>
    </div>
  )
}