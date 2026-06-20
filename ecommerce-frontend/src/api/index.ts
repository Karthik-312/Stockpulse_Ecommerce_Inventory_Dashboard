import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('user')
  if (raw) {
    const { token } = JSON.parse(raw)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
}

export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
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
