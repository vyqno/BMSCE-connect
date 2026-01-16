'use client'

import { useParams } from 'next/navigation'
import { Menu } from '@/components/Menu'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Canteen } from '@/types'

export default function CanteenMenuPage() {
  const params = useParams()
  const canteenId = params.canteenId as string
  const [canteen, setCanteen] = useState<Canteen | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCanteen() {
      const { data } = await supabase
        .from('canteens')
        .select('*')
        .eq('id', canteenId)
        .single()
      if (data) setCanteen(data)
    }
    fetchCanteen()
  }, [canteenId])

  return (
    <div className="container px-4 py-20 max-w-7xl mx-auto">
      <Link href="/canteens">
        <Button variant="ghost" className="mb-12 text-gray-500 hover:text-orange-600 hover:bg-orange-50 font-bold px-0">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Canteens
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
        <div>
          <h1 className="text-5xl md:text-6xl font-black font-outfit tracking-tight text-gray-900 px-1">
            {canteen?.name || 'Loading Menu...'}
          </h1>
          <p className="text-xl text-gray-500 mt-2 font-medium"> Explore available food items in {canteen?.name} </p>
        </div>
      </div>

      <Menu canteenId={canteenId} />
    </div>
  )
}
