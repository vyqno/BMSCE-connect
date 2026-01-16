'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, IndianRupee, ShoppingBag, Calendar, ArrowUp, ArrowDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

type TimeFilter = 'today' | 'week' | 'month'

interface AnalyticsData {
  popularItems: { name: string; count: number }[]
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  previousPeriodRevenue: number
  previousPeriodOrders: number
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    popularItems: [],
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    previousPeriodRevenue: 0,
    previousPeriodOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today')
  const params = useParams()
  const canteenId = params.canteenId as string
  const supabase = createClient()

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true)
      
      // Calculate date ranges based on filter
      const now = new Date()
      let startDate: Date
      let previousStartDate: Date
      let previousEndDate: Date

      switch (timeFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          previousStartDate = new Date(startDate)
          previousStartDate.setDate(previousStartDate.getDate() - 1)
          previousEndDate = startDate
          break
        case 'week':
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 7)
          previousStartDate = new Date(startDate)
          previousStartDate.setDate(previousStartDate.getDate() - 7)
          previousEndDate = startDate
          break
        case 'month':
          startDate = new Date(now)
          startDate.setDate(now.getDate() - 30)
          previousStartDate = new Date(startDate)
          previousStartDate.setDate(previousStartDate.getDate() - 30)
          previousEndDate = startDate
          break
      }

      // Fetch current period orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total_amount, created_at')
        .eq('canteen_id', canteenId)
        .eq('payment_status', 'paid')
        .gte('created_at', startDate.toISOString())

      // Fetch previous period orders for comparison
      const { data: previousOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('canteen_id', canteenId)
        .eq('payment_status', 'paid')
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', previousEndDate.toISOString())

      // Get popular items for the period
      const { data: itemData } = await supabase
        .from('order_items')
        .select(`
          quantity,
          orders!inner (
            canteen_id,
            created_at,
            payment_status
          ),
          menu_items!inner (
            name
          )
        `)
        .eq('orders.canteen_id', canteenId)
        .eq('orders.payment_status', 'paid')
        .gte('orders.created_at', startDate.toISOString())

      const itemsMap = new Map<string, number>()
      itemData?.forEach((row: any) => {
        const name = row.menu_items.name
        itemsMap.set(name, (itemsMap.get(name) || 0) + row.quantity)
      })

      const sortedItems = Array.from(itemsMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0
      const totalOrders = orders?.length || 0
      const previousPeriodRevenue = previousOrders?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0
      const previousPeriodOrders = previousOrders?.length || 0

      setData({
        popularItems: sortedItems,
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        previousPeriodRevenue,
        previousPeriodOrders,
      })
      setLoading(false)
    }

    fetchAnalytics()
  }, [canteenId, timeFilter])

  const revenueChange = data.previousPeriodRevenue > 0 
    ? ((data.totalRevenue - data.previousPeriodRevenue) / data.previousPeriodRevenue * 100).toFixed(1)
    : data.totalRevenue > 0 ? '100' : '0'
  
  const ordersChange = data.previousPeriodOrders > 0
    ? ((data.totalOrders - data.previousPeriodOrders) / data.previousPeriodOrders * 100).toFixed(1)
    : data.totalOrders > 0 ? '100' : '0'

  const filterLabels: Record<TimeFilter, string> = {
    today: 'Today',
    week: 'This Week',
    month: 'This Month',
  }

  const previousLabels: Record<TimeFilter, string> = {
    today: 'yesterday',
    week: 'last week',
    month: 'last month',
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-4xl font-extrabold font-outfit">Analytics</h1>
        
        {/* Time Filter */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {(['today', 'week', 'month'] as TimeFilter[]).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeFilter(filter)}
              className={timeFilter === filter 
                ? 'bg-orange-600 hover:bg-orange-700 text-white rounded-lg' 
                : 'text-gray-600 hover:text-gray-900 rounded-lg'
              }
            >
              <Calendar className="h-4 w-4 mr-1" />
              {filterLabels[filter]}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Revenue</CardTitle>
            <IndianRupee className="h-5 w-5 text-orange-200" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{data.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              {Number(revenueChange) >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-300" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-300" />
              )}
              <span className={Number(revenueChange) >= 0 ? 'text-green-200' : 'text-red-200'}>
                {Math.abs(Number(revenueChange))}% vs {previousLabels[timeFilter]}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Orders</CardTitle>
            <ShoppingBag className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{data.totalOrders}</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              {Number(ordersChange) >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600" />
              )}
              <span className={Number(ordersChange) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(Number(ordersChange))}% vs {previousLabels[timeFilter]}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Order Value</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">₹{data.averageOrderValue.toFixed(0)}</div>
            <p className="text-sm text-gray-400 mt-2">Per order average</p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Items */}
      <Card className="border-none shadow-md rounded-3xl overflow-hidden">
        <CardHeader className="bg-orange-50 border-b border-orange-100/50">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Most Popular Items - {filterLabels[timeFilter]}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {data.popularItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders during this period
            </div>
          ) : (
            <div className="space-y-6">
              {data.popularItems.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 tracking-tight">{item.name}</p>
                    <div className="w-full bg-gray-100 h-2 rounded-full mt-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${(item.count / data.popularItems[0].count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{item.count}</p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Orders</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
