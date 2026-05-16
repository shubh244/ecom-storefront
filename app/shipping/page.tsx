import Link from 'next/link'
import { FiTruck, FiPackage, FiMapPin } from 'react-icons/fi'

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-10 sm:py-14 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Shipping & Delivery</h1>
        <p className="mt-2 text-white/90 max-w-2xl mx-auto">
          Reliable delivery for furniture orders across Delhi NCR and Pan India.
        </p>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
        <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <FiTruck className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Free shipping threshold</h2>
              <p className="text-gray-600 leading-relaxed">
                Orders above <strong>₹20,000</strong> qualify for free shipping on standard delivery to
                eligible pin codes. Below that, a nominal shipping fee may apply at checkout.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <FiPackage className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Lead times</h2>
              <p className="text-gray-600 leading-relaxed">
                In-stock items are typically dispatched within the timeline shown on the product page.
                Custom or made-to-order pieces may require additional production time; our team will
                confirm after you place an order.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <FiMapPin className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Service areas</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We serve Delhi NCR with showroom support and ship to many locations across India.
                Enter your pin code at checkout to confirm serviceability.
              </p>
              <Link href="/contact" className="text-primary font-semibold hover:underline">
                Contact us for delivery questions →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
