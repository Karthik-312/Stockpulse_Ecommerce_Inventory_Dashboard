import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productApi, cartApi } from '../api'
import type { Product } from '../types'
import { useAuth } from '../context/AuthContext'
import { getCategoryGradient } from '../components/ProductCard'
import { mapCategory } from '../utils/categoryMap'
import { ArrowLeft, ShoppingCart, Minus, Plus, Package, Tag, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    productApi
      .getById(Number(id))
      .then((res) => setProduct(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setAdding(true)
    try {
      await cartApi.add(product!.id, quantity)
      toast.success(`Added ${quantity} × ${product!.name} to cart`)
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600" />
      </div>
    )
  }

  const gradient = getCategoryGradient(product.category)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-8 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-200">
          <div className="grid md:grid-cols-2">
            <div
              className={`h-72 md:h-full min-h-[360px] bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <Package className="h-32 w-32 text-white/70" />
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-3 py-1 rounded-full">
                  {mapCategory(product.category)}
                </span>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    product.inStock
                      ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950'
                      : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950'
                  }`}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{product.name}</h1>
              <p className="text-gray-400 dark:text-gray-500 mb-6">SKU: {product.sku}</p>

              <div className="mb-8">
                {product.price != null && product.price > 0 ? (
                  product.discountPercentage > 0 && product.finalPrice != null ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                          ₹{product.finalPrice.toFixed(2)}
                        </span>
                        <span className="text-sm font-bold text-white bg-emerald-500 px-3 py-1 rounded-full">
                          {product.discountPercentage}% OFF
                        </span>
                      </div>
                      <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                        MRP: ₹{product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        You save ₹{(product.price - product.finalPrice).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      ₹{product.price.toFixed(2)}
                    </span>
                  )
                ) : (
                  <span className="text-lg text-gray-400 dark:text-gray-500 italic font-medium">Contact for price</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 transition-colors">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                    <BarChart3 className="h-4 w-4" />
                    Stock Level
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{product.currentStock}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 transition-colors">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                    <Tag className="h-4 w-4" />
                    Status
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                    {product.status.toLowerCase()}
                  </p>
                </div>
              </div>

              {product.inStock && ((product.finalPrice != null && product.finalPrice > 0) || (product.price != null && product.price > 0)) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Quantity:</span>
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-5 py-2 font-semibold text-center min-w-[3.5rem] border-x border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.currentStock, quantity + 1))}
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="w-full bg-purple-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {adding ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        Add to Cart &mdash; ₹{((product.finalPrice ?? product.price ?? 0) * quantity).toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              )}

              {product.inStock && (product.price == null || product.price === 0) && (
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-amber-700 dark:text-amber-400 text-sm font-medium">
                  Price not set for this product. Please contact us for pricing.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
