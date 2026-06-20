import { useState, useEffect, useRef } from 'react'
import { productApi } from '../api'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import { ChevronLeft, ChevronRight, Zap, TrendingUp, Package } from 'lucide-react'

const categoryIcons: Record<string, string> = {
  Electronics: '💻',
  Clothing: '👕',
  Food: '🍕',
  Books: '📚',
  Home: '🏠',
  Sports: '⚽',
  Toys: '🧸',
  Health: '💊',
  Beauty: '💄',
  Automotive: '🚗',
}

function getCategoryIcon(category: string): string {
  return categoryIcons[category] || '📦'
}

interface HomePageProps {
  search: string
}

export default function HomePage({ search }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [error, setError] = useState('')
  const categoryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    productApi
      .getAll()
      .then((res) => setProducts(res.data))
      .catch(() =>
        setError('Failed to load products. Make sure StockPulse API is running on port 8080.')
      )
      .finally(() => setLoading(false))
  }, [])

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))]

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || p.category === category
    return matchesSearch && matchesCategory
  })

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryRef.current) {
      const scrollAmount = 200
      categoryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-purple-200 border-t-purple-600" />
          <span className="text-sm text-gray-500">Loading products...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Category Scroll Bar */}
      {!error && products.length > 0 && (
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center py-4">
              <button
                onClick={() => scrollCategories('left')}
                className="absolute left-0 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-purple-600 transition-colors border border-gray-100 hidden sm:flex"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div
                ref={categoryRef}
                className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-0 sm:px-10 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all shrink-0 min-w-[80px] ${
                      category === cat
                        ? 'bg-purple-50 border-2 border-purple-500 shadow-sm'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-purple-50 hover:border-purple-200'
                    }`}
                  >
                    <span className="text-xl">{getCategoryIcon(cat)}</span>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        category === cat ? 'text-purple-700' : 'text-gray-600'
                      }`}
                    >
                      {cat}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => scrollCategories('right')}
                className="absolute right-0 z-10 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 hover:text-purple-600 transition-colors border border-gray-100 hidden sm:flex"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotional Banner */}
      {!error && products.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm font-semibold text-purple-200 uppercase tracking-wide">Real-time Stock</span>
                </div>
                <h3 className="text-xl font-bold mb-1">Live Inventory Tracking</h3>
                <p className="text-purple-200 text-sm">All products synced with StockPulse inventory in real-time</p>
              </div>
              <div className="absolute right-4 top-4 opacity-10">
                <Package className="h-24 w-24" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-emerald-200" />
                  <span className="text-sm font-semibold text-emerald-200 uppercase tracking-wide">Smart Shopping</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{products.length} Products Available</h3>
                <p className="text-emerald-200 text-sm">Browse across {categories.length - 1} categories with instant stock updates</p>
              </div>
              <div className="absolute right-4 top-4 opacity-10">
                <TrendingUp className="h-24 w-24" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl mb-6 text-center text-sm font-medium">
            {error}
          </div>
        )}

        {/* Section Title */}
        {!error && filtered.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">
              {category === 'All' ? 'All Products' : category}
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({filtered.length} {filtered.length === 1 ? 'item' : 'items'})
              </span>
            </h2>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500 text-base font-medium">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  )
}
