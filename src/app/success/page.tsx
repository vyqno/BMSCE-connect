'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="container px-4 py-20 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
      <div className="relative mb-12">
        <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
          <CheckCircle2 className="h-16 w-16 text-orange-600" />
        </div>
        <div className="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-lg animate-bounce delay-100">
          <span className="text-2xl">❤️</span>
        </div>
        <div className="absolute -bottom-2 -left-2 bg-white p-2 rounded-full shadow-lg animate-bounce delay-300">
          <span className="text-2xl">🍕</span>
        </div>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 font-outfit">
        Yay! Order <span className="text-orange-600">Confimred!</span>
      </h1>
      
      <div className="space-y-4 mb-12">
        <p className="text-2xl text-gray-700 font-medium font-outfit">
          Thank you so much for ordering with us! 
        </p>
        <p className="text-lg text-gray-500 leading-relaxed font-inter">
          Your delicious meal is now being prepared with love at the canteen. 
          We've sent your order details to the kitchen, and they're already getting started.
        </p>
        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 mt-8">
          <p className="text-orange-800 font-bold italic">
            "Good food is all the sweeter when shared with good friends."
          </p>
          <p className="text-orange-600 text-sm mt-2 font-medium">— BMSCE Canteen Connect Team</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Link href="/orders" className="w-full">
          <Button variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 font-bold py-8 rounded-3xl text-lg flex items-center justify-center gap-2">
            Track My Food
          </Button>
        </Link>
        <Link href="/" className="w-full">
          <Button className="w-full bg-orange-600 hover:bg-orange-700 font-bold py-8 rounded-3xl text-lg shadow-lg shadow-orange-200 group">
            Order More
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
      
      <p className="mt-12 text-gray-400 text-sm italic">
        A small notification will appear on your orders page when it's ready for pickup!
      </p>
    </div>
  )
}
