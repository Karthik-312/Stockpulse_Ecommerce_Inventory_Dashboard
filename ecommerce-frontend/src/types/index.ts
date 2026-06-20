export interface Product {
  id: number
  name: string
  sku: string
  category: string
  currentStock: number
  status: string
  price: number | null
  inStock: boolean
}

export interface CartItem {
  id: number
  inventoryItemId: number
  productName: string
  quantity: number
  price: number
  subtotal: number
}

export interface OrderItem {
  id: number
  inventoryItemId: number
  productName: string
  quantity: number
  price: number
  subtotal: number
}

export interface Order {
  id: number
  orderDate: string
  status: string
  totalAmount: number
  items: OrderItem[]
}

export interface User {
  email: string
  firstName: string
  lastName: string
  token: string
}
