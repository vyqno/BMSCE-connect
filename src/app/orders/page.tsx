'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase'
import { Order, OrderItem } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, Clock, CheckCircle2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type OrderWithItems = Order & {
  order_items: (OrderItem & { menu_items: { name: string } })[]
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (name)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (data) setOrders(data as any)
      setLoading(false)
    }

    fetchOrders()
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="container px-4 py-12 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-12 w-64 mb-8" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Please sign in</h1>
        <p className="text-gray-500 mb-8">You need to be signed in to view your orders.</p>
        <Link href="/">
          <Button className="bg-orange-600 hover:bg-orange-700 font-bold px-8 py-6 rounded-full">
            Back to Menu
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto text-base">
      <h1 className="text-4xl font-extrabold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-orange-100">
          <ShoppingBag className="h-12 w-12 text-orange-200 mx-auto mb-4" />
          <p className="text-xl text-gray-400">You haven't placed any orders yet</p>
          <Link href="/" className="mt-4 block">
            <Button variant="link" className="text-orange-600 font-bold">
              Start ordering now
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="border-none shadow-md overflow-hidden rounded-3xl">
              <CardHeader className="bg-orange-50/50 flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <Package className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()} at{' '}
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <Badge 
                  className={`px-4 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    order.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent className="p-6">
                <div className="divide-y divide-gray-100">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="py-2 flex justify-between">
                      <span className="text-gray-600">
                        {item.menu_items.name} <span className="font-bold text-orange-600">x{item.quantity}</span>
                      </span>
                      <span className="font-bold">₹{item.price_at_time * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Total Amount</span>
                  <span className="text-2xl font-extrabold text-orange-600">₹{order.total_amount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
