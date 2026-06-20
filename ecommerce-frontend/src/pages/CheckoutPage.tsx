import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartApi, orderApi } from '../api'
import type { CartItem } from '../types'
import { Check, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    cartApi
      .get()
      .then((res) => {
        if (res.data.length === 0) navigate('/cart')
        setItems(res.data)
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)

  const placeOrder = async () => {
    setPlacing(true)
    try {
      await orderApi.checkout()
      setSuccess(true)
      toast.success('Order placed successfully!')
      window.dispatchEvent(new Event('cart-updated'))
      setTimeout(() => navigate('/orders'), 2500)
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined
      toast.error(message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-in fade-in">
          <div className="bg-green-100 rounded-full p-5 inline-block mb-6">
            <Check className="h-14 w-14 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h2>
          <p className="text-gray-500 text-lg">
            Thank you for your purchase. Redirecting to orders...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="font-medium text-gray-900">{item.productName}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Qty: {item.quantity} &times; ₹{item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-bold text-gray-900">₹{item.subtotal.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={placing}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none text-lg"
          >
            {placing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" />
                Place Order &mdash; ₹{total.toFixed(2)}
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Stock will be adjusted automatically via StockPulse API
          </p>
        </div>
      </div>
    </div>
  )
}
