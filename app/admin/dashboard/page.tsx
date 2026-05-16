'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiPackage, FiShoppingCart, FiClock, FiDollarSign, FiTag, FiGrid, FiImage } from 'react-icons/fi'
import { apiClient } from '@/lib/api'

interface DashboardStats {
  total_products: number
  total_orders: number
  pending_orders: number
  total_categories: number
  total_revenue: number
  hot_offers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [photoProductId, setPhotoProductId] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoBusy, setPhotoBusy] = useState(false)
  const [photoMessage, setPhotoMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    const fetchDashboard = async () => {
      try {
        const data = await apiClient.getAdminDashboard()
        if (data?.stats) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  const handleDashboardPhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setPhotoMessage(null)
    const id = parseInt(photoProductId.trim(), 10)
    if (!id || id < 1) {
      setPhotoMessage({ type: 'err', text: 'Enter a valid product ID (from the Products page).' })
      return
    }
    if (!photoFile) {
      setPhotoMessage({ type: 'err', text: 'Choose an image file to upload.' })
      return
    }
    setPhotoBusy(true)
    try {
      await apiClient.uploadAdminProductImage(id, photoFile)
      setPhotoMessage({
        type: 'ok',
        text: 'Photo updated. The product image field now points to the uploaded file URL.',
      })
      setPhotoFile(null)
    } catch (err) {
      setPhotoMessage({
        type: 'err',
        text: err instanceof Error ? err.message : 'Upload failed. Check product ID and try again.',
      })
    } finally {
      setPhotoBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-primary">
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <Link href="/admin/dashboard" className="py-4 border-b-2 border-primary font-semibold">
              Dashboard
            </Link>
            <Link href="/admin/products" className="py-4 hover:text-primary">
              Products
            </Link>
            <Link href="/admin/orders" className="py-4 hover:text-primary">
              Orders
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Statistics</h2>
        
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-primary">{stats.total_products}</p>
                </div>
                <FiPackage className="text-4xl text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-green-600">{stats.total_orders}</p>
                </div>
                <FiShoppingCart className="text-4xl text-green-600 opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Pending Orders</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending_orders}</p>
                </div>
                <FiClock className="text-4xl text-yellow-600 opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-blue-600">₹{stats.total_revenue.toLocaleString()}</p>
                </div>
                <FiDollarSign className="text-4xl text-blue-600 opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Categories</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.total_categories}</p>
                </div>
                <FiGrid className="text-4xl text-purple-600 opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Hot Offers</p>
                  <p className="text-3xl font-bold text-red-600">{stats.hot_offers}</p>
                </div>
                <FiTag className="text-4xl text-red-600 opacity-50" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/admin/products" className="block w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-lg text-center">
                Manage Products
              </Link>
              <Link href="/admin/orders" className="block w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-center">
                View Orders
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <FiImage className="text-2xl text-primary" />
              <h3 className="text-xl font-bold">Replace product photo</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Upload a new image for any product by ID. The stored image URL on that product is replaced with the file you upload (same as Products → edit → upload).
            </p>
            <form onSubmit={handleDashboardPhotoUpload} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                <input
                  type="number"
                  min={1}
                  value={photoProductId}
                  onChange={(e) => setPhotoProductId(e.target.value)}
                  placeholder="e.g. 42"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image file</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
              </div>
              {photoMessage ? (
                <p
                  className={`text-sm ${photoMessage.type === 'ok' ? 'text-green-700' : 'text-red-600'}`}
                >
                  {photoMessage.text}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={photoBusy}
                className="w-full bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-lg font-semibold disabled:opacity-50"
              >
                {photoBusy ? 'Uploading…' : 'Upload & replace photo'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

