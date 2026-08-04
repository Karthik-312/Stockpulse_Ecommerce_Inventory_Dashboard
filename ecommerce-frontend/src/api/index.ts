import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 90_000,
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('user')
  if (raw) {
    const { token } = JSON.parse(raw)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delay = 4000
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err: any) {
      const isRetryable =
        !err.response || err.response.status === 503 || err.response.status >= 500
      if (attempt < retries && isRetryable) {
        await new Promise((r) => setTimeout(r, delay * (attempt + 1)))
        continue
      }
      throw err
    }
  }
  throw new Error('Request failed after retries')
}

export const authApi = {
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
}

export const productApi = {
  getAll: () => fetchWithRetry(() => api.get('/products')),
  getById: (id: number) => fetchWithRetry(() => api.get(`/products/${id}`)),
}

export const cartApi = {
  get: () => api.get('/cart'),
  add: async (inventoryItemId: number, quantity: number) => {
    const res = await api.post('/cart', { inventoryItemId, quantity })
    window.dispatchEvent(new Event('cart-updated'))
    return res
  },
  updateQuantity: async (id: number, quantity: number) => {
    const res = await api.put(`/cart/${id}?quantity=${quantity}`)
    window.dispatchEvent(new Event('cart-updated'))
    return res
  },
  remove: async (id: number) => {
    const res = await api.delete(`/cart/${id}`)
    window.dispatchEvent(new Event('cart-updated'))
    return res
  },
}

export const orderApi = {
  checkout: () => api.post('/orders/checkout'),
  getAll: () => api.get('/orders'),
}

export default api
