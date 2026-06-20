import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { ShoppingBag } from 'lucide-react'

const categoryGradients: Record<string, string> = {
  Electronics: 'from-blue-400 to-indigo-500',
  Clothing: 'from-pink-400 to-rose-500',
  Food: 'from-green-400 to-emerald-500',
  Books: 'from-amber-400 to-orange-500',
  Home: 'from-purple-400 to-violet-500',
  Sports: 'from-cyan-400 to-teal-500',
  Toys: 'from-yellow-400 to-amber-500',
  Health: 'from-lime-400 to-green-500',
}

export function getCategoryGradient(category: string): string {
  return categoryGradients[category] || 'from-slate-400 to-slate-500'
}

export default function ProductCard({ product }: { product: Product }) {
  const gradient = getCategoryGradient(product.category)

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-purple-100 transition-all duration-200">
        {/* Product Image Area */}
        <div className={`h-32 sm:h-36 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
          <ShoppingBag className="h-10 w-10 text-white/80 group-hover:scale-110 transition-transform duration-200" />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                Out of Stock
              </span>
            </div>
          )}
          {product.inStock && product.currentStock <= 5 && (
            <div className="absolute top-2 left-2">
              <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
                Only {product.currentStock} left
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
            {product.category}
          </span>
          <h3 className="font-semibold text-gray-900 text-sm mt-2 leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2.5">
            {product.price != null && product.price > 0 ? (
              <span className="text-base font-bold text-gray-900">
                ₹{product.price.toFixed(2)}
              </span>
            ) : (
              <span className="text-xs font-medium text-gray-400 italic">
                Price not set
              </span>
            )}
            {product.inStock && (
              <span className="text-[11px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                In Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
