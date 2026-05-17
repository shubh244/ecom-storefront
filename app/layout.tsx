import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/Header'
import AppFooter from '@/components/AppFooter'
import WhatsAppButton from '@/components/WhatsAppButton'
import MobileBottomNav from '@/components/MobileBottomNav'
import AppMain from '@/components/AppMain'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import PwaRegister from '@/components/PwaRegister'
import InstallAppPrompt from '@/components/InstallAppPrompt'
import { SITE_NAME, getSiteUrl, siteSeo, organizationJsonLd, getOgImageUrl } from '@/lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteSeo.homeTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: siteSeo.defaultDescription,
  keywords: [...siteSeo.keywords],
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: SITE_NAME,
    title: siteSeo.homeTitle,
    description: siteSeo.defaultDescription,
    images: [{ url: getOgImageUrl(), width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteSeo.homeTitle,
    description: siteSeo.defaultDescription,
    images: [getOgImageUrl()],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  category: 'shopping',
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'default',
  },
  applicationName: SITE_NAME,
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    shortcut: ['/icons/icon-192.png'],
  },
  other: {
    'geo.region': 'IN-DL',
    'geo.placename': 'New Delhi',
    'geo.position': '28.6423;77.1227',
    ICBM: '28.6423, 77.1227',
  },
}

const jsonLd = JSON.stringify(organizationJsonLd())

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#8B4513',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN">
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <ToastProvider>
          <CartProvider>
            <Header />
            <AppMain>{children}</AppMain>
            <AppFooter />
            <MobileBottomNav />
            <WhatsAppButton />
            <InstallAppPrompt />
            <PwaRegister />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}

