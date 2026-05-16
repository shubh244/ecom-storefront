'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiLock, FiUser } from 'react-icons/fi'
import { getPublicApiUrl } from '@/lib/site'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const apiBase = getPublicApiUrl()
    const loginUrl = `${apiBase}/admin/login`

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const text = await response.text()
      let data: {
        success?: boolean
        message?: string
        token?: string
        user?: unknown
        errors?: Record<string, string[]>
      } = {}

      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        setError(
          `The server did not return JSON (${response.status}). Check Vercel env NEXT_PUBLIC_API_URL — it must be your API base ending in /api (currently: ${apiBase}), not the storefront URL.`
        )
        return
      }

      if (!response.ok) {
        if (response.status === 422 && data.errors) {
          const first = Object.values(data.errors).flat()[0]
          setError(typeof first === 'string' ? first : data.message || 'Validation failed')
        } else {
          setError(data.message || `Login failed (${response.status})`)
        }
        return
      }

      if (data.success && data.token) {
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_user', JSON.stringify(data.user ?? {}))
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch {
      setError('Network error. Check your connection, CORS on the API, and NEXT_PUBLIC_API_URL.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Login</h1>
          <p className="text-gray-600">Shreejee Blessings Wood — Admin</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="admin"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Default credentials:</p>
          <p className="font-mono">admin / !Admin@123</p>
        </div>
      </div>
    </div>
  )
}

