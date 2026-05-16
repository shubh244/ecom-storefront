'use client'

import { FiTruck, FiRefreshCw, FiShield, FiHeadphones, FiGift } from 'react-icons/fi'
import { SITE_NAME } from '@/lib/site'

export default function Footer({ edgeToEdge = false }: { edgeToEdge?: boolean }) {
  return (
    <footer
      className={`bg-gray-900 text-white ${edgeToEdge ? '' : 'app-footer-mobile-pad'}`}
    >
      {/* Features Section */}
      <div className="bg-gray-800 py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <FiTruck className="text-3xl text-yellow-400" />
              <div>
                <h3 className="font-semibold">Free Shipping</h3>
                <p className="text-sm text-gray-400">For all orders over ₹20000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiRefreshCw className="text-3xl text-yellow-400" />
              <div>
                <h3 className="font-semibold">1 & 1 Returns</h3>
                <p className="text-sm text-gray-400">Cancellation after 1 day</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiShield className="text-3xl text-yellow-400" />
              <div>
                <h3 className="font-semibold">100% Secure Payment</h3>
                <p className="text-sm text-gray-400">Guarantee secure payments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiHeadphones className="text-3xl text-yellow-400" />
              <div>
                <h3 className="font-semibold">24/7 Dedicated Support</h3>
                <p className="text-sm text-gray-400">Anywhere & anytime</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiGift className="text-3xl text-yellow-400" />
              <div>
                <h3 className="font-semibold">Daily Offers</h3>
                <p className="text-sm text-gray-400">Discount up to 70% OFF</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">{SITE_NAME} — Wooden Furniture Delhi & Pan India</h3>
            <p className="text-gray-400 mb-4">
              {SITE_NAME} offers premium solid wood and tailor-made furniture with showrooms in Delhi NCR and reliable delivery across India — beds, sofas, dining sets, and complete home solutions.
            </p>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center gap-2">
                <span className="font-semibold">Hotline 24/7:</span>
                <a href="tel:8467082350" className="hover:text-yellow-400">8467082350</a>
                <span>|</span>
                <a href="tel:9760232667" className="hover:text-yellow-400">9760232667</a>
              </p>
              <p>
                <a href="mailto:info@shreejeeblessingwood.in" className="hover:text-yellow-400">info@shreejeeblessingwood.in</a>
              </p>
              <p>Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM</p>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Useful Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/terms" className="hover:text-yellow-400">Terms & Conditions</a></li>
              <li><a href="/refund" className="hover:text-yellow-400">Refund Policy</a></li>
              <li><a href="/privacy" className="hover:text-yellow-400">Privacy Policy</a></li>
              <li><a href="/faqs" className="hover:text-yellow-400">FAQs</a></li>
              <li><a href="/payment" className="hover:text-yellow-400">Payment Policy</a></li>
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h3 className="text-xl font-bold mb-4">Help Center</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/about" className="hover:text-yellow-400">About us</a></li>
              <li><a href="/affiliate" className="hover:text-yellow-400">Affiliate</a></li>
              <li><a href="/career" className="hover:text-yellow-400">Career</a></li>
              <li><a href="/contact" className="hover:text-yellow-400">Contact us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Register now to get updates on promotions and coupon. Don't worry! We not spam
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              />
              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white py-2 rounded font-semibold transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              ©{new Date().getFullYear()} {SITE_NAME}. All Rights Reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-yellow-400">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-yellow-400">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-yellow-400">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

