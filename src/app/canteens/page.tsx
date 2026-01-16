'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Canteen } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function CanteensPage() {
  const [canteens, setCanteens] = useState<Canteen[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCanteens() {
      const { data } = await supabase.from('canteens').select('*')
      if (data) setCanteens(data)
      setLoading(false)
    }
    fetchCanteens()
  }, [])

  const canteenMeta: Record<string, { image: string }> = {
    'Vidyarthi Khaana': { 
      image: '/images/vidyarthi_khaana.jpg',
    },
    'Main Canteen': { 
      image: '/images/vidyarthi_khaana.jpg',
    },
    'SRS CAFE': { 
      image: '/images/srs_cafe.jpg',
    },
    'SRS Cafe': { 
      image: '/images/srs_cafe.jpg',
    },
    'Science Block Canteen': { 
      image: 'https://images.unsplash.com/photo-1567529684892-0f29670d2f14?auto=format&fit=crop&q=80&w=800',
    },
    'Sip and Snack': { 
      image: '/images/sip-snack.png',
    },
    'MBA Canteen': { 
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-20 max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-12 font-outfit">Choosing your <span className="text-orange-600">Canteen</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[450px] w-full rounded-[40px]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-20 max-w-7xl mx-auto">
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 font-outfit tracking-tighter">
          Explore our <span className="text-orange-600 underline decoration-orange-200">Canteens</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
          Choose from our 3 specialized canteens, each offering a unique culinary experience tailored for the BMSCE campus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {canteens.map((canteen) => {
          const meta = canteenMeta[canteen.name] || { image: 'https://images.unsplash.com/photo-1567529684892-0f29670d2f14?auto=format&fit=crop&q=80&w=800' }
          return (
            <Link key={canteen.id} href={`/canteens/${canteen.id}`} className="group">
              <Card className="h-full border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[40px] overflow-hidden bg-white flex flex-col group-hover:-translate-y-4">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={meta.image} 
                    alt={canteen.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <CardContent className="p-8 flex-1 flex flex-col">
                  <h2 className="text-3xl font-black mb-4 text-gray-900 font-outfit tracking-tight group-hover:text-orange-600 transition-colors">
                    {canteen.name}
                  </h2>
                  <div className="flex items-center text-gray-400 mb-8 font-medium">
                    <MapPin className="w-4 h-4 mr-2 text-orange-400" />
                    {canteen.location || 'Campus Center'}
                  </div>
                  
                  <div className="mt-auto">
                    <Button className="w-full h-16 bg-gray-50 hover:bg-orange-600 text-gray-900 hover:text-white font-bold rounded-3xl transition-all duration-300 flex items-center justify-between px-8 border border-gray-100 group-hover:border-transparent">
                      View Menu
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

import { Badge } from '@/components/ui/badge'
