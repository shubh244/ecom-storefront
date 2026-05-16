import Link from 'next/link'
import { FiShield, FiCreditCard, FiLock } from 'react-icons/fi'

export default function PaymentPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-10 sm:py-14 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Payment & Security</h1>
        <p className="mt-2 text-white/90 max-w-2xl mx-auto">
          Multiple payment options with industry-standard security at checkout.
        </p>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
        <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-green-500/10 text-green-700">
              <FiShield className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Safe & secure</h2>
              <p className="text-gray-600 leading-relaxed">
                Checkout uses encrypted connections. Card and UPI flows are processed through trusted
                payment partners; we do not store your full card details on our servers.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <FiCreditCard className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Accepted methods</h2>
              <p className="text-gray-600 leading-relaxed">
                We support major cards, UPI, net banking, and wallets where available. Exact methods
                may vary by order value and issuer rules shown at payment time.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <FiLock className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Refunds & disputes</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Eligible refunds follow our refund policy and are processed to the original payment
                method where possible.
              </p>
              <Link href="/contact" className="text-primary font-semibold hover:underline">
                Billing questions? Contact us →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
