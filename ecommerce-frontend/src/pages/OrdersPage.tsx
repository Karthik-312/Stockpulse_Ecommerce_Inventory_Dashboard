import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderApi } from '../api'
import type { Order } from '../types'
import { Package, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react'

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-green-50 text-green-700',
  PROCESSING: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-purple-50 text-purple-700',
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-red-50 text-red-700',
  PENDING: 'bg-yellow-50 text-yellow-700',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    orderApi
      .getAll()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Place your first order to see it here</p>
          <Link
            to="/"
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-50 rounded-xl p-3 hidden sm:block">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      statusColors[order.status] || 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-bold text-gray-900 text-base sm:text-lg">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                  {expanded === order.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {expanded === order.id && (
                <div className="border-t border-gray-100 px-5 sm:px-6 pb-5 sm:pb-6">
                  <table className="w-full mt-4">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                        <th className="pb-3">Product</th>
                        <th className="pb-3 text-center">Qty</th>
                        <th className="pb-3 text-right">Price</th>
                        <th className="pb-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3 font-medium text-gray-900">{item.productName}</td>
                          <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                          <td className="py-3 text-right text-gray-600">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="py-3 text-right font-semibold text-gray-900">
                            ₹{item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
