import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { ShoppingBag } from 'lucide-react'
import { mapCategory } from '../utils/categoryMap'

const categoryGradients: Record<string, string> = {
  Electronics: 'from-blue-400 to-indigo-500',
  Clothing: 'from-pink-400 to-rose-500',
  'Food & Beverages': 'from-green-400 to-emerald-500',
  Books: 'from-amber-400 to-orange-500',
  Home: 'from-purple-400 to-violet-500',
  Sports: 'from-cyan-400 to-teal-500',
  Toys: 'from-yellow-400 to-amber-500',
  Health: 'from-lime-400 to-green-500',
  Snacks: 'from-orange-400 to-red-500',
  'Fruits & Vegetables': 'from-green-500 to-lime-500',
  Groceries: 'from-yellow-500 to-orange-500',
  Beverages: 'from-sky-400 to-blue-500',
  Dairy: 'from-blue-200 to-sky-400',
  Bakery: 'from-amber-300 to-yellow-500',
  'Personal Care': 'from-pink-400 to-fuchsia-500',
  Household: 'from-teal-400 to-cyan-500',
  'Office Supplies': 'from-slate-400 to-gray-500',
  Furniture: 'from-amber-500 to-orange-600',
  General: 'from-gray-400 to-slate-500',
}

export function getCategoryGradient(category: string): string {
  return categoryGradients[mapCategory(category)] || categoryGradients[category] || 'from-slate-400 to-slate-500'
}

export default function ProductCard({ product }: { product: Product }) {
  const displayCategory = mapCategory(product.category)
  const gradient = getCategoryGradient(product.category)

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-purple-100 dark:hover:border-purple-900 transition-all duration-200">
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
          <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full uppercase tracking-wide">
            {displayCategory}
          </span>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mt-2 leading-tight line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-2.5">
            {product.price != null && product.price > 0 ? (
              product.discountPercentage > 0 && product.finalPrice != null ? (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                      ₹{product.finalPrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-bold text-white bg-emerald-500 px-1.5 py-0.5 rounded-full">
                      {product.discountPercentage}% OFF
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                  ₹{product.price.toFixed(2)}
                </span>
              )
            ) : (
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500 italic">
                Price not set
              </span>
            )}
            {product.inStock && (
              <span className="text-[11px] font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-1.5 py-0.5 rounded">
                In Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
