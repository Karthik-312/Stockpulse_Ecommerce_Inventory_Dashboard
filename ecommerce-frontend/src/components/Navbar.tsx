import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Package, LogOut, User, Search, Sun, Moon, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useEffect, useState } from 'react'
import { cartApi } from '../api'

interface NavbarProps {
  search?: string
  onSearchChange?: (value: string) => void
  showSearch?: boolean
}

export default function Navbar({ search = '', onSearchChange, showSearch = true }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const loadCartCount = () => {
      if (isAuthenticated) {
        cartApi.get().then(res => {
          setCartCount(
            res.data.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)
          )
        }).catch(() => setCartCount(0))
      } else {
        setCartCount(0)
      }
    }

    loadCartCount()
    window.addEventListener('cart-updated', loadCartCount)
    return () => window.removeEventListener('cart-updated', loadCartCount)
  }, [isAuthenticated])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Zap className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              StockPulse
            </span>
          </Link>

          {/* Search Bar - Centered */}
          {showSearch && (
            <div className="flex-1 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder='Search for "products"'
                  value={search}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggle}
              className="relative w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-gray-600 dark:text-yellow-400 hover:text-purple-600 dark:hover:text-yellow-300 transition-all duration-200"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-2">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-purple-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/orders" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-2">
                  <Package className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden md:block font-medium">
                    {user?.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors text-sm px-3 py-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
