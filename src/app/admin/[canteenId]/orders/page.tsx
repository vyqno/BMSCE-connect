'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Phone, Mail, Calendar, User, ShoppingBag } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface OrderData {
  id: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  order_items: {
    id: string
    quantity: number
    price_at_time: number
    menu_items: { name: string } | null
  }[]
  profiles: { full_name: string | null, phone: string | null, email: string | null } | null
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const canteenId = params.canteenId as string
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()

    // Subscribe to order changes
    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders',
        filter: `canteen_id=eq.${canteenId}`
      }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [canteenId])

  async function fetchOrders() {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: queryError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          payment_status,
          created_at,
          order_items (
            id,
            quantity,
            price_at_time,
            menu_items (name)
          ),
          profiles (full_name, phone, email)
        `)
        .eq('canteen_id', canteenId)
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false })

      if (queryError) {
        console.error('Query error:', queryError)
        setError(queryError.message)
      } else {
        console.log('Orders fetched:', data)
        setOrders((data as unknown as OrderData[]) || [])
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Failed to fetch orders')
    }
    
    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 font-medium">Error loading orders: {error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="bg-orange-100 p-3 rounded-2xl">
          <ShoppingBag className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold font-outfit">Orders</h1>
          <p className="text-gray-500 text-sm">{orders.length} total orders</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50 border-b border-orange-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Order ID</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Items</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Date & Time</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-bold text-orange-600">
                        #{order.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-800">
                            {order.profiles?.full_name || 'Guest Customer'}
                          </span>
                        </div>
                        {order.profiles?.email && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Mail className="h-3 w-3" />
                            {order.profiles.email}
                          </div>
                        )}
                        {order.profiles?.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone className="h-3 w-3" />
                            {order.profiles.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {order.order_items && order.order_items.length > 0 ? (
                          order.order_items.map((item) => (
                            <div key={item.id} className="text-sm">
                              <span className="text-gray-700">{item.menu_items?.name || 'Unknown Item'}</span>
                              <span className="ml-2 text-orange-600 font-bold">×{item.quantity}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No items</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-lg font-bold text-gray-900">₹{order.total_amount}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(order.created_at)}
                        </div>
                        <span className="text-xs text-gray-500 ml-5">{formatTime(order.created_at)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        ✓ Paid
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <CheckCircle2 className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-lg text-gray-400">No orders yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
