import { createFileRoute } from '@tanstack/react-router'
import { HeroCentered } from '@beach-box/unify-ui'
import { Mail, Phone, MapPin, Clock, MessageSquare, Building } from 'lucide-react'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/contact')({
  component: Contact,
  validateSearch: (search: Record<string, unknown>) => ({
    subject: (search.subject as string) || undefined,
    model: (search.model as string) || undefined,
  }),
})

function Contact() {
  const { subject, model } = Route.useSearch()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    venueName: '',
    dailyVisitors: '',
    location: '',
    partnershipModel: ''
  })

  // Pre-populate form based on URL parameters
  useEffect(() => {
    if (subject) {
      setFormData(prev => ({ ...prev, subject }))
    }
    if (model) {
      setFormData(prev => ({ ...prev, partnershipModel: model }))
    }
  }, [subject, model])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you for contacting us! We\'ll get back to you soon.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="flex flex-col pt-20">
      {/* Hero Section */}
      <section className="pb-20">
        <HeroCentered
          title="Apply for Partnership"
          description="Ready to add a revenue-generating amenity to your venue? Let's discuss how Beach Box can benefit your business."
          announcement={undefined}
          primaryCta={undefined}
          secondaryCta={undefined}
          socialProof={undefined}
          backgroundImage={undefined}
        />
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-beach-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-beach-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Partnership Hotline</h3>
              <p className="text-gray-600">1-800-SUNSCREEN</p>
              <p className="text-gray-600">(1-800-786-7273)</p>
              <p className="text-sm text-gray-500 mt-2">Mon-Fri 9AM-6PM EST</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-beach-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-beach-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Partnership Team</h3>
              <a href="mailto:partnerships@beachboxflorida.com" className="text-beach-600 hover:text-beach-700">
                partnerships@beachboxflorida.com
              </a>
              <p className="text-sm text-gray-500 mt-2">Response within 4 hours</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-beach-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-beach-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Our Offices</h3>
              <p className="text-gray-600">123 Beach Blvd</p>
              <p className="text-gray-600">Miami Beach, FL 33139</p>
              <p className="text-sm text-gray-500 mt-2">Headquarters & Demo Center</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Application Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Partnership Application</h2>
            <p className="text-center text-gray-600 mb-12">
              Tell us about your venue and we'll create a customized partnership proposal
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beach-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beach-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beach-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Type *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beach-500"
                  >
                    <option value="">Select venue type</option>
                    <option value="hotel">Hotel/Resort</option>
                    <option value="government">Government/Public Pool</option>
                    <option value="community">Community/HOA Pool</option>
                    <option value="waterpark">Water Park/Amusement Park</option>
                    <option value="marina">Marina/Beach Club</option>
                    <option value="golf">Golf Course</option>
                    <option value="other">Other Outdoor Venue</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="venueName" className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    id="venueName"
                    name="venueName"
                    required
                    value={formData.venueName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beach-500"
                  />
                </div>

                <div>
                  <label htmlFor="dailyVisitors" className="block text-sm font-medium text-gray-700 mb-1">
                    Daily Visitors (Average) *
                  </label>
                  <select
                    id="dailyVisitors"
                    name="dailyVisitors"
                    required
                    value={formData.dailyVisitors || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beach-500"
                  >
                    <option value="">Select range</option>
                    <option value="50-100">50-100 visitors</option>
                    <option value="100-200">100-200 visitors</option>
                    <option value="200-500">200-500 visitors</option>
                    <option value="500+">500+ visitors</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Address *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  placeholder="City, FL"
                  value={formData.location || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beach-500"
                />
              </div>

              <div>
                <label htmlFor="partnershipModel" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Partnership Model
                </label>
                <select
                  id="partnershipModel"
                  name="partnershipModel"
                  value={formData.partnershipModel || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beach-500"
                >
                  <option value="">Not sure - recommend for me</option>
                  <option value="revenue-share">Revenue Share (most popular)</option>
                  <option value="rental">Monthly Rental</option>
                  <option value="lease">Machine Lease</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beach-500"
                  placeholder="Tell us about your venue, outdoor areas, guest demographics, or any specific questions..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-beach-500 text-white rounded-lg hover:bg-beach-600 transition-colors font-medium"
                >
                  Submit Partnership Application
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  We'll contact you within 24 hours to schedule a consultation
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Options */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Other Ways to Connect</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-beach-500 mr-3" />
                  <h3 className="text-xl font-semibold">Schedule Site Visit</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Ready for an in-person consultation? Our team can visit your venue to assess placement and discuss terms.
                </p>
                <a href="mailto:partnerships@beachboxflorida.com?subject=Site Visit Request" className="text-beach-600 hover:text-beach-700 font-medium">
                  Book site visit →
                </a>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-6 w-6 text-beach-500 mr-3" />
                  <h3 className="text-xl font-semibold">Download Info Pack</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Get detailed information about partnership models, case studies, and revenue projections.
                </p>
                <a href="mailto:partnerships@beachboxflorida.com?subject=Info Pack Request" className="text-beach-600 hover:text-beach-700 font-medium">
                  Download materials →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}