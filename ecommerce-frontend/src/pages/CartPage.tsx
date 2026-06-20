import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { cartApi } from '../api'
import type { CartItem } from '../types'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadCart = () => {
    cartApi
      .get()
      .then((res) => setItems(res.data))
      .catch(() => toast.error('Failed to load cart'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCart()
  }, [])

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return
    try {
      await cartApi.updateQuantity(id, quantity)
      loadCart()
    } catch {
      toast.error('Failed to update quantity')
    }
  }

  const removeItem = async (id: number) => {
    try {
      await cartApi.remove(id)
      loadCart()
    } catch {
      toast.error('Failed to remove item')
    }
  }

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
          <Link
            to="/"
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
          >
            Browse Products <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">
                      {item.productName}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      ₹{item.price.toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold min-w-[3rem] text-center border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="font-bold text-gray-900 min-w-[5rem] text-right">
                      ₹{item.subtotal.toFixed(2)}
                    </span>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-semibold hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
