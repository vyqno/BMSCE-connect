export interface Profile {
  id: string
  email: string
  phone: string | null
  full_name: string | null
  role: 'user' | 'admin'
  admin_canteen_id: string | null
  created_at: string
  updated_at: string
}

export interface Canteen {
  id: string
  name: string
  location: string | null
  created_at: string
}

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description: string | null
  is_available: boolean
  canteen_id: string
  created_at: string
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface Order {
  id: string
  user_id: string
  canteen_id: string
  total_amount: number
  status: 'pending' | 'preparing' | 'ready' | 'completed'
  payment_status: 'pending' | 'paid' | 'failed'
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  razorpay_signature: string | null
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  price_at_time: number
  created_at: string
  menu_item?: MenuItem
}
