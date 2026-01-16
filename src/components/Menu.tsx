'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Canteen, MenuItem } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MenuItemCard } from './MenuItemCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, UtensilsCrossed } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function Menu({ canteenId: initialCanteenId }: { canteenId?: string }) {
  const router = useRouter()
  const [canteens, setCanteens] = useState<Canteen[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCanteen, setActiveCanteen] = useState<string | null>(initialCanteenId || null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: canteensData } = await supabase.from('canteens').select('*')
      const { data: menuData } = await supabase.from('menu_items').select('*')
      
      if (canteensData) {
        setCanteens(canteensData)
        // Only set default if one isn't already active
        if (canteensData.length > 0 && !activeCanteen) {
          setActiveCanteen(canteensData[0].id)
        }
      }
      if (menuData) setMenuItems(menuData)
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (initialCanteenId && initialCanteenId !== activeCanteen) {
      setActiveCanteen(initialCanteenId)
      setActiveCategory(null)
    }
  }, [initialCanteenId])

  const availableCategories = Array.from(
    new Set(menuItems.filter(item => item.canteen_id === activeCanteen).map((item) => item.category))
  )

  const filteredItems = menuItems.filter(
    (item) =>
      item.canteen_id === activeCanteen &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!activeCategory || item.category === activeCategory)
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8 px-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Tabs value={activeCanteen || ''} onValueChange={(val) => {
          setActiveCanteen(val)
          setActiveCategory(null) // Reset category when switching canteens
          router.push(`/canteens/${val}`)
        }} className="w-full md:w-auto">
          <TabsList className="bg-orange-50 p-1.5 gap-2">
            {canteens.map((canteen) => (
              <TabsTrigger
                key={canteen.id}
                value={canteen.id}
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white px-5 py-2"
              >
                {canteen.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for food..."
            className="pl-10 border-orange-100 focus:border-orange-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={activeCategory === null ? 'default' : 'outline'}
          className={activeCategory === null ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200 text-orange-600 hover:bg-orange-50'}
          onClick={() => setActiveCategory(null)}
        >
          All Items
        </Button>
        {availableCategories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            className={activeCategory === category ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200 text-orange-600 hover:bg-orange-50'}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="space-y-12">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-orange-100">
            <p className="text-xl text-gray-400">No items found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
