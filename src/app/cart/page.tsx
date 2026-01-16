'use client'

import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart()
  const { user, signInWithGoogle } = useAuth()

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="container px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-orange-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. 
          Browse our menu to find something delicious!
        </p>
        <Link href="/">
          <Button className="bg-orange-600 hover:bg-orange-700 font-bold px-8 py-6 rounded-full">
            Back to Menu
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 flex items-center gap-3">
        Your Cart <span className="text-orange-600">({totalItemCount})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-orange-600 font-bold mt-1">₹{item.price}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-none shadow-lg bg-white rounded-3xl overflow-hidden">
            <div className="p-6 bg-orange-600 text-white">
              <h2 className="text-xl font-bold">Order Summary</h2>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Items</span>
                <span>{totalItemCount}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-extrabold text-2xl">
                <span>Total</span>
                <span className="text-orange-600">₹{totalAmount}</span>
              </div>
              
              {user ? (
                <Link href="/checkout" className="block w-full pt-4">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 font-bold text-lg py-6 rounded-2xl group">
                    Checkout 
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <div className="pt-4 space-y-4">
                  <p className="text-xs text-center text-gray-500">Please sign in to continue</p>
                  <Button 
                    onClick={() => signInWithGoogle()}
                    className="w-full bg-orange-600 hover:bg-orange-700 font-bold text-lg py-6 rounded-2xl"
                  >
                    Sign In to Checkout
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
