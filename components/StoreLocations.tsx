'use client'

import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi'

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

export default function StoreLocations() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Our Store Locations
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Visit us at any of our showrooms across Delhi NCR
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {storeLocations.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 border border-gray-100 transform hover:-translate-y-2"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                  <FiMapPin className="text-2xl text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    {store.name}
                  </h3>
                  {store.landmark && (
                    <p className="text-sm text-gray-500 mb-3 italic">
                      📍 {store.landmark}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-gray-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {store.address}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <FiPhone className="text-gray-400 flex-shrink-0" />
                  <a
                    href={`tel:${store.phone}`}
                    className="text-primary hover:text-secondary font-semibold text-sm sm:text-base"
                  >
                    {store.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <FiMail className="text-gray-400 flex-shrink-0" />
                  <a
                    href={`mailto:${store.email}`}
                    className="text-primary hover:text-secondary text-sm sm:text-base break-all"
                  >
                    {store.email}
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <FiClock className="text-gray-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-600 text-sm sm:text-base">
                    {store.hours}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-secondary font-semibold text-sm sm:text-base transition"
                >
                  <FiMapPin />
                  Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-xl p-6 sm:p-8 text-white text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Need Help? Contact Us 24/7
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <FiPhone className="text-xl" />
              <a href="tel:8467082350" className="text-lg font-semibold hover:text-yellow-300">
                8467082350
              </a>
            </div>
            <span className="hidden sm:block">|</span>
            <div className="flex items-center gap-2">
              <FiPhone className="text-xl" />
              <a href="tel:9760232667" className="text-lg font-semibold hover:text-yellow-300">
                9760232667
              </a>
            </div>
            <span className="hidden sm:block">|</span>
            <div className="flex items-center gap-2">
              <FiMail className="text-xl" />
              <a
                href="mailto:info@shreejeeblessingwood.in"
                className="text-lg font-semibold hover:text-yellow-300"
              >
                info@shreejeeblessingwood.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

