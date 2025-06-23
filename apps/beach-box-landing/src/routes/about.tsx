import { createFileRoute } from '@tanstack/react-router'
import { HeroCentered, FeaturesGrid, StatsSimple, CTASimple } from '@beach-box/unify-ui'
import { DollarSign, Shield, Wrench, Users, Award, Globe } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="flex flex-col pt-20">
      {/* Hero Section */}
      <section className="pb-20">
        <HeroCentered
          title="Trusted Partnership for Venue Operators"
          description="Beach Box was founded to help venue operators generate revenue while providing essential sun safety amenities to their guests. We're the reliable partner venues trust."
          announcement={{
            text: "Founded 2023 • 50+ Venue Partners • $1M Liability Coverage"
          }}
          primaryCta={{
            text: "Schedule Partnership Consultation",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "View Partnership Models",
            href: "/partnership-models"
          }}
          socialProof={undefined}
          backgroundImage={undefined}
        />
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Partnership Story</h2>
              <p className="text-gray-600 mb-6">
                Beach Box Florida was founded by venue operators who understood the challenges of providing guest amenities
                while managing operational costs. We saw an opportunity to create a win-win solution: venues get a revenue-generating
                amenity while guests get convenient access to essential sun protection.
              </p>
              <p className="text-gray-600 mb-6">
                Starting with our first partnership at an Orlando-area resort in 2023, we quickly learned what venue operators
                really need: zero hassle, guaranteed revenue, and happy guests. Our partnership model evolved to remove every
                operational burden from venues while maximizing their earning potential.
              </p>
              <p className="text-gray-600">
                Today, we partner with 50+ venues across Florida - from luxury resorts to government facilities. Every partnership
                is built on trust, transparency, and mutual success. We're not just a vendor; we're your revenue partner focused
                on enhancing your guest experience and your bottom line.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <FeaturesGrid
          title="Our Partnership Principles"
          description="What venue operators can expect from Beach Box"
          columns={3}
          features={[
            {
              icon: Shield,
              title: "Reliability & Trust",
              description: "We deliver on our promises with professional service, full insurance coverage, and transparent reporting that venue operators can depend on."
            },
            {
              icon: DollarSign,
              title: "Mutual Success",
              description: "Our revenue-sharing model aligns our success with yours. When your venue thrives, we thrive. True partnership means shared goals."
            },
            {
              icon: Wrench,
              title: "Operational Excellence",
              description: "We handle every detail so you don't have to. From installation to maintenance, we maintain the highest professional standards."
            },
            {
              icon: Users,
              title: "Guest-Focused Solutions",
              description: "Everything we do enhances your guest experience. Happy guests become loyal guests, and loyal guests drive revenue."
            },
            {
              icon: Award,
              title: "Industry Leadership",
              description: "We're pioneers in venue-focused sunscreen solutions, continuously innovating to provide better value for our partners."
            },
            {
              icon: Globe,
              title: "Florida Expertise",
              description: "We understand Florida's unique climate, regulations, and venue needs. Local knowledge creates better partnerships."
            }
          ]}
        />
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <StatsSimple
          title="Our Impact"
          description="Making a difference one application at a time"
          columns={4}
          stats={[
            {
              value: "500K",
              suffix: "+",
              label: "Sunburns Prevented",
              description: "Based on customer feedback"
            },
            {
              value: "50",
              suffix: "+",
              label: "Active Locations",
              description: "Across Florida"
            },
            {
              value: "100",
              suffix: "%",
              label: "Reef-Safe Products",
              description: "Protecting our oceans"
            },
            {
              value: "4.9",
              suffix: "/5",
              label: "Customer Rating",
              description: "From thousands of reviews"
            }
          ]}
        />
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Passionate about sun safety and innovation
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-br from-beach-400 to-ocean-500 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">JD</span>
                </div>
                <h3 className="text-xl font-semibold mb-1">John Davis</h3>
                <p className="text-gray-600 mb-2">Founder & CEO</p>
                <p className="text-sm text-gray-500">
                  20+ years in vending technology and a lifelong beach enthusiast
                </p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-br from-beach-400 to-ocean-500 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">SR</span>
                </div>
                <h3 className="text-xl font-semibold mb-1">Sarah Rodriguez</h3>
                <p className="text-gray-600 mb-2">VP of Operations</p>
                <p className="text-sm text-gray-500">
                  Expert in logistics and passionate about environmental sustainability
                </p>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-br from-beach-400 to-ocean-500 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">MT</span>
                </div>
                <h3 className="text-xl font-semibold mb-1">Michael Thompson</h3>
                <p className="text-gray-600 mb-2">Head of Partnerships</p>
                <p className="text-sm text-gray-500">
                  Building relationships with venues across Florida to expand access
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-beach-50">
        <CTASimple
          title="Ready to Partner With Beach Box?"
          description="Join 50+ venue operators across Florida who trust Beach Box for revenue generation and guest satisfaction."
          variant="default"
          primaryCta={{
            text: "Apply for Partnership",
            onClick: () => window.location.href = '/contact'
          }}
          secondaryCta={{
            text: "View Partnership Models",
            href: "/partnership-models"
          }}
        />
      </section>
    </div>
  )
}