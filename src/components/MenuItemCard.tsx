'use client'

import { MenuItem } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/use-cart'
import { Plus, Minus, ShoppingBasket } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCart()
  const cartItem = items.find((i) => i.id === item.id)

  const handleAddToCart = () => {
    addItem(item)
    toast.success(`${item.name} added to cart! 🍕`)
  }

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 group rounded-3xl bg-white border border-gray-100/50">
      <CardHeader className="p-0 relative">
        <div className="h-4 w-full bg-gradient-to-r from-orange-500 to-orange-600" />
        <div className="px-6 pt-6 pb-2 flex justify-between items-start">
          <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-none px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {item.category}
          </Badge>
          {!item.is_available && (
            <Badge variant="destructive" className="rounded-full px-3 py-1 font-bold">Sold Out</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-4">
        <div className="flex justify-between items-baseline mb-4">
          <h3 className="font-black text-2xl text-gray-900 group-hover:text-orange-600 transition-colors font-outfit tracking-tight">
            {item.name}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Price</span>
            <span className="text-3xl font-black text-orange-600 tracking-tighter">₹{item.price}</span>
          </div>
          
          <div className="flex flex-col items-end min-w-[140px]">
            <AnimatePresence mode="wait">
              {cartItem ? (
                <motion.div 
                  key="quantity"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner w-full justify-between"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                    className="h-9 w-9 rounded-xl hover:bg-white hover:text-orange-600 hover:shadow-sm transition-all"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <motion.span 
                    key={cartItem.quantity}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="font-black text-orange-600 text-lg"
                  >
                    {cartItem.quantity}
                  </motion.span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                    className="h-9 w-9 rounded-xl hover:bg-white hover:text-orange-600 hover:shadow-sm transition-all"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="add-button"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="w-full"
                >
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black px-6 h-12 rounded-2xl shadow-lg shadow-orange-100 transition-all hover:scale-105 active:scale-95 group/btn"
                    onClick={handleAddToCart}
                    disabled={!item.is_available}
                  >
                    <Plus className="mr-2 h-5 w-5 group-hover/btn:rotate-90 transition-transform" />
                    Add
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
