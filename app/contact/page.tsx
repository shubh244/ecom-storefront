'use client'

import { useState } from 'react'
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi'

const storeLocations = [
  {
    id: 1,
    name: 'Main Showroom - Rajouri Garden',
    address: '131, Gupta Palace, Block A, Rajouri Garden, New Delhi - 110027',
    phone: '8467082350',
    email: 'rajouri@shreejeeblessingwood.in',
    hours: 'Mon - Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM',
    landmark: 'Near Metro Station, Opposite City Mall',
  },
  {
    id: 2,
    name: 'Gurgaon Showroom',
    address: 'Shop No. 45, Sector 29, DLF Galleria, Gurgaon - 122002, Haryana',
    phone: '9760232667',
    email: 'gurgaon@shreejeeblessingwood.in',
    hours: 'Mon - Sat: 10:00 AM - 9:00 PM, Sun: 11:00 AM - 7:00 PM',
    landmark: 'Ground Floor, Near Food Court',
  },
  {
    id: 3,
    name: 'Noida Showroom',
    address: 'Unit 12, Sector 18, Noida - 201301, Uttar Pradesh',
    phone: '8467082350',
    email: 'noida@shreejeeblessingwood.in',
    hours: 'Mon - Sat: 9:30 AM - 8:30 PM, Sun: 10:00 AM - 6:00 PM',
    landmark: 'Opposite City Centre Mall',
  },
  {
    id: 4,
    name: 'Warehouse & Factory',
    address: 'Industrial Area, Phase 2, Faridabad - 121003, Haryana',
    phone: '9760232667',
    email: 'factory@shreejeeblessingwood.in',
    hours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    landmark: 'Near Haryana State Industrial Development Corporation',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl sm:text-2xl text-white/90">
            We'd love to hear from you. Get in touch with us!
          </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPhone className="text-3xl text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <a href="tel:8467082350" className="text-primary hover:text-secondary font-semibold block mb-1">
              8467082350
            </a>
            <a href="tel:9760232667" className="text-primary hover:text-secondary font-semibold block">
              9760232667
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-3xl text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <a
              href="mailto:info@shreejeeblessingwood.in"
              className="text-primary hover:text-secondary font-semibold break-all"
            >
              info@shreejeeblessingwood.in
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiClock className="text-3xl text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Business Hours</h3>
            <p className="text-gray-600">Mon - Sat: 9:00 AM - 8:00 PM</p>
            <p className="text-gray-600">Sunday: 10:00 AM - 6:00 PM</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FiUser /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FiMail /> Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <FiPhone /> Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Product Inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FiMessageSquare /> Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
              >
                <FiSend />
                Send Message
              </button>
            </form>
          </div>

          {/* Store Locations */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Our Store Locations</h2>
            <div className="space-y-4">
              {storeLocations.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{store.name}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-start gap-2">
                      <FiMapPin className="mt-1 flex-shrink-0 text-primary" />
                      <span className="text-sm">{store.address}</span>
                    </p>
                    {store.landmark && (
                      <p className="text-sm text-gray-500 italic ml-6">
                        📍 {store.landmark}
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <FiPhone className="text-primary" />
                      <a href={`tel:${store.phone}`} className="text-primary hover:text-secondary font-semibold">
                        {store.phone}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <FiMail className="text-primary" />
                      <a
                        href={`mailto:${store.email}`}
                        className="text-primary hover:text-secondary text-sm break-all"
                      >
                        {store.email}
                      </a>
                    </p>
                    <p className="flex items-start gap-2">
                      <FiClock className="mt-1 text-primary" />
                      <span className="text-sm">{store.hours}</span>
                    </p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold text-sm mt-4"
                  >
                    <FiMapPin />
                    Get Directions
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

