'use client'

import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export function CartFloatingButton() {
  const { items } = useCart()
  const { user } = useAuth()
  const pathname = usePathname()
  const controls = useAnimation()
  
  const count = items.reduce((acc, item) => acc + item.quantity, 0)
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  useEffect(() => {
    if (count > 0) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.3 }
      })
    }
  }, [count, controls])

  // Don't show on cart, checkout, or success pages, or if not logged in
  const hideOnPages = ['/cart', '/checkout', '/success']
  if (hideOnPages.includes(pathname) || items.length === 0 || !user) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
      >
        <Link href="/cart">
          <motion.div animate={controls}>
            <Button className="w-full h-20 bg-orange-600 hover:bg-orange-700 text-white rounded-3xl shadow-[0_20px_50px_rgba(234,88,12,0.4)] flex items-center justify-between px-8 group border-2 border-white/20 backdrop-blur-sm relative overflow-hidden transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="bg-white/20 p-3 rounded-2xl relative">
                  <ShoppingCart className="h-7 w-7" />
                  <motion.span 
                    key={count}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-2 -right-2 bg-white text-orange-600 text-[12px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                  >
                    {count}
                  </motion.span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] uppercase text-orange-100 font-black tracking-widest leading-none mb-1">Total Price</p>
                  <p className="text-2xl font-black font-outfit">₹{total}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 font-black text-xl relative z-10 font-outfit">
                View Cart
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </AnimatePresence>
  )
}
