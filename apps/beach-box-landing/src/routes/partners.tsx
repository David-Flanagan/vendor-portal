import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { HeroCentered, FeaturesGrid, StatsSimple, CTASimple } from '@beach-box/unify-ui'
import { DollarSign, Shield, Clock, BarChart, Users, Wrench } from 'lucide-react'

export const Route = createFileRoute('/partners')({
  component: Partners,
})

function Partners() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col pt-20">
      {/* Hero Section */}
      <section className="pb-20">
        <HeroCentered
          title="Partner With Beach Box"
          description="Join Florida's fastest-growing sun safety network and generate passive income while protecting your guests."
          announcement={undefined}
          socialProof={undefined}
          backgroundImage={undefined}
          primaryCta={{
            text: "Apply Now",
            onClick: () => navigate({ to: '/contact', search: { subject: undefined, model: undefined } })
          }}
          secondaryCta={{
            text: "Download Info Pack",
            href: "mailto:partnerships@beachboxflorida.com?subject=Info Pack Request"
          }}
        />
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <FeaturesGrid
          title="Why Partner with Beach Box?"
          description="A win-win solution for venues and guests"
          columns={3}
          features={[
            {
              icon: DollarSign,
              title: "Revenue Sharing",
              description: "Earn commission on every sale with our generous revenue sharing model. No costs to you."
            },
            {
              icon: Shield,
              title: "Zero Risk",
              description: "We provide the machine, handle maintenance, and manage inventory. You just provide the space."
            },
            {
              icon: Clock,
              title: "24/7 Service",
              description: "Our team monitors and maintains all machines remotely, ensuring minimal disruption to your operations."
            },
            {
              icon: BarChart,
              title: "Monthly Reports",
              description: "Track sales and revenue with detailed monthly reports and transparent accounting."
            },
            {
              icon: Users,
              title: "Guest Satisfaction",
              description: "Enhance your guest experience by providing convenient access to sun protection."
            },
            {
              icon: Wrench,
              title: "Full Support",
              description: "From installation to ongoing maintenance, our team handles everything."
            }
          ]}
        />
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-beach-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Apply & Qualify</h3>
                  <p className="text-gray-600">
                    Submit your application online. We'll review your venue's location, foot traffic, and suitability for a Beach Box machine.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-beach-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Site Visit & Agreement</h3>
                  <p className="text-gray-600">
                    Our team will visit your location to determine the best placement and finalize the partnership agreement.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-beach-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Installation</h3>
                  <p className="text-gray-600">
                    We handle all aspects of installation, including any necessary permits and electrical connections.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-beach-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold mb-2">Start Earning</h3>
                  <p className="text-gray-600">
                    Once installed, you'll start earning commission on every sale. We handle all maintenance, restocking, and customer service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ideal Locations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Ideal Partner Locations</h2>
            <p className="text-xl text-center text-muted-foreground mb-12">
              Beach Box machines thrive in high-traffic outdoor venues
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Beaches & Boardwalks",
                "Hotels & Resorts",
                "Public & Private Pools",
                "Water Parks",
                "Marinas & Docks",
                "Parks & Recreation Areas",
                "Golf Courses",
                "Outdoor Event Venues"
              ].map((location) => (
                <div key={location} className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <p className="font-medium">{location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Stats */}
      <section className="py-20">
        <StatsSimple
          title="Partner Success by the Numbers"
          description="Join our growing network of successful partners"
          columns={4}
          stats={[
            {
              value: "$800",
              suffix: "+",
              label: "Average Monthly Revenue",
              description: "Per machine"
            },
            {
              value: "95",
              suffix: "%",
              label: "Partner Retention",
              description: "Year over year"
            },
            {
              value: "4.8",
              suffix: "/5",
              label: "Partner Satisfaction",
              description: "From partner surveys"
            },
            {
              value: "30",
              suffix: "days",
              label: "Average Install Time",
              description: "From approval to operation"
            }
          ]}
        />
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Partners Say</h2>

            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-lg italic mb-4">
                  "Beach Box has been a fantastic addition to our resort. Guests love the convenience, and the revenue sharing has exceeded our expectations."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold">Jennifer Martinez</p>
                    <p className="text-sm text-gray-600">General Manager, Oceanfront Resort Miami</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <p className="text-lg italic mb-4">
                  "Zero hassle, pure profit. Beach Box handles everything, and our beachgoers appreciate having sunscreen readily available."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold">Robert Chen</p>
                    <p className="text-sm text-gray-600">Parks Director, City of Clearwater</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-beach-50">
        <CTASimple
          title="Ready to Become a Beach Box Partner?"
          description="Join our network and start generating additional revenue while protecting your guests from harmful UV rays."
          variant="default"
          primaryCta={{
            text: "Apply to Become a Partner",
            onClick: () => navigate({ to: '/contact', search: { subject: 'partnership', model: undefined } })
          }}
          secondaryCta={{
            text: "Schedule a Call",
            href: "/contact"
          }}
        />
      </section>
    </div>
  )
}