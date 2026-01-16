'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, IndianRupee, TrendingUp, CheckCircle2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedToday: 0,
  })
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const canteenId = params.canteenId as string
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      // Get all orders for this canteen
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, status, created_at')
        .eq('canteen_id', canteenId)

      if (orders) {
        const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total_amount), 0)
        const pendingOrders = orders.filter(o => o.status !== 'completed').length
        const completedToday = orders.filter(o => 
          o.status === 'completed' && 
          new Date(o.created_at).toDateString() === new Date().toDateString()
        ).length

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders,
          completedToday,
        })
      }
      setLoading(false)
    }

    fetchStats()
  }, [canteenId])

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 text-base">
      <h1 className="text-4xl font-extrabold font-outfit">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-orange-100" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-orange-100 mt-1">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalOrders}</div>
            <p className="text-xs text-gray-400 mt-1">Lifetime order count</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.completedToday}</div>
            <p className="text-xs text-gray-400 mt-1">Orders delivered today</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Welcome Card */}
      <Card className="border-none shadow-md rounded-3xl overflow-hidden mt-12">
        <CardHeader>
          <CardTitle>Welcome to Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Use the sidebar to view detailed analytics for your canteen.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
