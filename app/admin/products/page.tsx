'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi'
import { Product, Category } from '@/lib/types'
import { apiClient } from '@/lib/api'
import { resolveProductImageUrl } from '@/lib/productImage'

const PER_PAGE = 20

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [listLoading, setListLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: PER_PAGE,
    from: 0 as number | null,
    to: 0 as number | null,
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchCategories()
  }, [router])

  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = searchTerm.trim()
      setDebouncedSearch((prev) => {
        if (prev !== next) setPage(1)
        return next
      })
    }, 400)
    return () => window.clearTimeout(id)
  }, [searchTerm])

  const loadProducts = useCallback(async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setListLoading(true)
    try {
      const params: Record<string, string | number> = {
        per_page: PER_PAGE,
        page,
      }
      if (debouncedSearch) params.search = debouncedSearch
      if (categoryFilter !== 'all') params.category_id = categoryFilter

      const paginator = await apiClient.getAdminProducts(params)
      const list = paginator?.data
      setProducts(Array.isArray(list) ? list : [])
      setPagination({
        current_page: typeof paginator?.current_page === 'number' ? paginator.current_page : 1,
        last_page: typeof paginator?.last_page === 'number' ? paginator.last_page : 1,
        total: typeof paginator?.total === 'number' ? paginator.total : 0,
        per_page: typeof paginator?.per_page === 'number' ? paginator.per_page : PER_PAGE,
        from: paginator?.from ?? null,
        to: paginator?.to ?? null,
      })
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setListLoading(false)
      setLoading(false)
    }
  }, [page, debouncedSearch, categoryFilter])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const fetchCategories = async () => {
    try {
      const list = await apiClient.getCategories()
      setCategories(Array.isArray(list) ? list : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await apiClient.deleteAdminProduct(id)
      if (products.length === 1 && page > 1) {
        setPage((p) => Math.max(1, p - 1))
      } else {
        await loadProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const goToPage = (next: number) => {
    const clamped = Math.max(1, Math.min(next, pagination.last_page))
    setPage(clamped)
  }

  const handleRowImageReplace = async (productId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      await apiClient.uploadAdminProductImage(productId, file)
      await loadProducts()
    } catch (err) {
      console.error('Row image upload failed:', err)
      alert(err instanceof Error ? err.message : 'Image upload failed')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Product Management</h1>
          <Link href="/admin/dashboard" className="text-gray-600 hover:text-primary">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setPage(1)
                  setCategoryFilter(e.target.value)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setShowModal(true)
                }}
                className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
              >
                <FiPlus /> Add Product
              </button>
            </div>
          </div>

          <div className={`overflow-x-auto relative ${listLoading ? 'opacity-60' : ''}`}>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Hot Offer</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && !listLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No products on this page. Try another page or clear filters.
                    </td>
                  </tr>
                ) : null}
                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-1.5">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center shrink-0">
                          {product.image ? (
                            <img src={resolveProductImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover rounded" />
                          ) : (
                            <span className="text-2xl">🪑</span>
                          )}
                        </div>
                        <label className="inline-flex items-center gap-1 text-xs font-semibold text-primary cursor-pointer hover:underline">
                          <FiImage className="w-3.5 h-3.5" />
                          <span>Upload / replace</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className="sr-only"
                            onChange={(ev) => handleRowImageReplace(product.id, ev)}
                          />
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{product.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                        {product.category?.name || categories.find(c => c.id === product.category_id)?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-bold text-primary">₹{product.price.toLocaleString()}</span>
                        {product.original_price && (
                          <span className="text-gray-400 line-through ml-2">
                            ₹{product.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {product.hot_offer ? (
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                          {product.offer_percentage}% OFF
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product)
                            setShowModal(true)
                          }}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(pagination.total > 0 || pagination.last_page > 1) && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {pagination.total === 0 ? (
                  'No products match these filters.'
                ) : (
                  <>
                    Showing{' '}
                    <span className="font-medium">
                      {pagination.from ?? 0}–{pagination.to ?? 0}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span>
                    {pagination.last_page > 1 ? (
                      <span className="text-gray-500"> ({pagination.per_page} per page)</span>
                    ) : null}
                  </>
                )}
              </p>
              {pagination.last_page > 1 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1 || listLoading}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 px-2 tabular-nums">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= pagination.last_page || listLoading}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Next
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowModal(false)
            setEditingProduct(null)
          }}
          onSave={() => {
            void loadProducts()
            setShowModal(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

function ProductModal({ product, categories, onClose, onSave }: {
  product: Product | null
  categories: Category[]
  onClose: () => void
  onSave: () => void
}) {
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    category_id: product?.category_id || categories[0]?.id || 0,
    subcategory: product?.subcategory || '',
    description: product?.description || '',
    image: product?.image || '',
    rating: product?.rating || 0,
    reviews: product?.reviews || 0,
    in_stock: product?.in_stock ?? true,
    is_featured: product?.is_featured || false,
    hot_offer: product?.hot_offer || false,
    offer_percentage: product?.offer_percentage || 0,
  })
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!product) {
      setPendingImageFile(file)
      return
    }
    setUploadingImage(true)
    try {
      const { url } = await apiClient.uploadAdminProductImage(product.id, file)
      setFormData((prev) => ({ ...prev, image: url }))
    } catch (err) {
      console.error('Image upload failed:', err)
      alert(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (product) {
        await apiClient.updateAdminProduct(product.id, formData)
      } else {
        const created = await apiClient.createAdminProduct(formData)
        const newId = typeof created?.id === 'number' ? created.id : null
        if (pendingImageFile && newId) {
          try {
            await apiClient.uploadAdminProductImage(newId, pendingImageFile)
          } catch (uploadErr) {
            console.error('Post-create image upload failed:', uploadErr)
            alert(
              uploadErr instanceof Error
                ? uploadErr.message
                : 'Product was created but image upload failed. Edit the product to upload a photo.'
            )
          }
        }
        setPendingImageFile(null)
      }
      onSave()
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Original Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Image</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://… or upload below"
                className="w-full px-3 py-2 border rounded-lg mb-2"
              />
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageFile}
                    disabled={uploadingImage}
                    className="text-sm"
                  />
                  {uploadingImage ? (
                    <span>Uploading…</span>
                  ) : product ? (
                    <span>Upload file (replaces current photo)</span>
                  ) : (
                    <span>
                      {pendingImageFile
                        ? `Will upload after save: ${pendingImageFile.name}`
                        : 'Choose file — uploads after product is created'}
                    </span>
                  )}
                </label>
                {formData.image ? (
                  <img src={resolveProductImageUrl(formData.image)} alt="" className="h-14 w-14 object-cover rounded border" />
                ) : pendingImageFile && !product ? (
                  <span className="text-xs text-gray-500">Preview available after save</span>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subcategory</label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.in_stock}
                onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                className="w-4 h-4"
              />
              <label>In Stock</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label>Featured</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.hot_offer}
                onChange={(e) => setFormData({ ...formData, hot_offer: e.target.checked })}
                className="w-4 h-4"
              />
              <label>Hot Offer</label>
            </div>

            {formData.hot_offer && (
              <div>
                <label className="block text-sm font-medium mb-1">Offer Percentage</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.offer_percentage}
                  onChange={(e) => setFormData({ ...formData, offer_percentage: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

