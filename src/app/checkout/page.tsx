'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, CreditCard, Utensils, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [orderType, setOrderType] = useState('dine-in')
  const [formData, setFormData] = useState({
    phone: '',
    tableNumber: '',
  })
  const [errors, setErrors] = useState({
    phone: '',
    tableNumber: '',
  })

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  useEffect(() => {
    if (items.length === 0) {
      router.push('/')
    }
  }, [items.length, router])

  if (items.length === 0) {
    return null
  }

  const handlePlaceOrder = async () => {
    // Validate phone number
    if (!formData.phone) {
      toast.error('Please enter your phone number')
      setErrors(prev => ({ ...prev, phone: 'Phone number is required' }))
      return
    }
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number')
      setErrors(prev => ({ ...prev, phone: 'Phone number must be exactly 10 digits' }))
      return
    }

    // Validate table number for dine-in
    if (orderType === 'dine-in') {
      if (!formData.tableNumber) {
        toast.error('Please enter your table number')
        setErrors(prev => ({ ...prev, tableNumber: 'Table number is required' }))
        return
      }
      const tableNum = parseInt(formData.tableNumber)
      if (isNaN(tableNum) || tableNum < 1 || tableNum > 25) {
        toast.error('Table number must be between 1 and 25')
        setErrors(prev => ({ ...prev, tableNumber: 'Table number must be between 1 and 25' }))
        return
      }
    }

    if (!user) {
      toast.error('Please sign in to place an order')
      return
    }

    setLoading(true)
    
    try {
      // 1. Create Razorpay Order
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      })
      const order = await res.json()

      // 2. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'BMSCE Canteen Connect',
        description: 'Food Order Payment',
        order_id: order.id,
        handler: async (response: any) => {
          // 3. Verify Payment
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          })
          const verifyData = await verifyRes.json()

          if (verifyData.status === 'ok') {
            // 4. Create Order in Supabase
            const { createClient } = await import('@/lib/supabase')
            const supabase = createClient()
            
            // Insert order
            const { data: orderData, error: orderError } = await supabase
              .from('orders')
              .insert({
                user_id: user.id,
                canteen_id: items[0].canteen_id, // Assuming all items from same canteen for now
                total_amount: totalAmount,
                status: 'pending',
                payment_status: 'paid',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
              .select()
              .single()

            if (orderError) throw orderError

            // Insert order items
            const orderItems = items.map((item) => ({
              order_id: orderData.id,
              menu_item_id: item.id,
              quantity: item.quantity,
              price_at_time: item.price,
            }))

            const { error: itemsError } = await supabase
              .from('order_items')
              .insert(orderItems)

            if (itemsError) throw itemsError

            toast.success('Yay! Your delicious order is on its way to the kitchen! 🍕❤️')
            clearCart()
            router.push('/success')
          } else {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: user.user_metadata?.full_name,
          email: user.email,
          contact: formData.phone,
          // 👇 ADD YOUR UPI ID HERE (replace with your actual UPI)
          vpa: '9900455775@ibl',  // Example: 'john@oksbi', 'shop@paytm', '9876543210@ybl'
        },
        theme: {
          color: '#ea580c',
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
      
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container px-4 py-12 max-w-4xl mx-auto">
      <Link href="/cart" className="flex items-center text-orange-600 hover:gap-2 transition-all mb-8 group font-bold">
        <ArrowLeft className="h-5 w-5 mr-2 group-hover:mr-3" />
        Back to Cart
      </Link>

      <h1 className="text-4xl font-extrabold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden rounded-3xl">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-orange-600" />
                Order Type
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup value={orderType} onValueChange={setOrderType} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="dine-in" id="dine-in" className="sr-only" />
                  <Label
                    htmlFor="dine-in"
                    className={`flex flex-col items-center justify-between rounded-2xl border-2 p-4 hover:bg-orange-50 cursor-pointer ${
                      orderType === 'dine-in' ? 'border-orange-600 bg-orange-50' : 'border-gray-100'
                    }`}
                  >
                    <Utensils className={`h-8 w-8 mb-2 ${orderType === 'dine-in' ? 'text-orange-600' : 'text-gray-400'}`} />
                    <span className="font-bold">Dine-in</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="takeaway" id="takeaway" className="sr-only" />
                  <Label
                    htmlFor="takeaway"
                    className={`flex flex-col items-center justify-between rounded-2xl border-2 p-4 hover:bg-orange-50 cursor-pointer ${
                      orderType === 'takeaway' ? 'border-orange-600 bg-orange-50' : 'border-gray-100'
                    }`}
                  >
                    <ShoppingBag className={`h-8 w-8 mb-2 ${orderType === 'takeaway' ? 'text-orange-600' : 'text-gray-400'}`} />
                    <span className="font-bold">Takeaway</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden rounded-3xl">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setFormData({ ...formData, phone: value })
                    if (value.length === 10) {
                      setErrors(prev => ({ ...prev, phone: '' }))
                    } else if (value.length > 0) {
                      setErrors(prev => ({ ...prev, phone: 'Phone number must be exactly 10 digits' }))
                    } else {
                      setErrors(prev => ({ ...prev, phone: '' }))
                    }
                  }}
                  className={`rounded-xl border-orange-100 focus:border-orange-600 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              {orderType === 'dine-in' && (
                <div className="space-y-2">
                  <Label htmlFor="table">Table Number (1-25)</Label>
                  <Input
                    id="table"
                    type="number"
                    min="1"
                    max="25"
                    placeholder="Enter table number (1-25)"
                    value={formData.tableNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      const num = parseInt(value)
                      setFormData({ ...formData, tableNumber: value })
                      if (value && (isNaN(num) || num < 1 || num > 25)) {
                        setErrors(prev => ({ ...prev, tableNumber: 'Table number must be between 1 and 25' }))
                      } else {
                        setErrors(prev => ({ ...prev, tableNumber: '' }))
                      }
                    }}
                    className={`rounded-xl border-orange-100 focus:border-orange-600 ${errors.tableNumber ? 'border-red-500' : ''}`}
                  />
                  {errors.tableNumber && (
                    <p className="text-red-500 text-sm">{errors.tableNumber}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24 border-none shadow-lg bg-white rounded-3xl overflow-hidden">
            <div className="p-6 bg-orange-600 text-white">
              <h2 className="text-xl font-bold font-outfit">Order Review</h2>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {item.name} <span className="text-orange-600 font-bold">x{item.quantity}</span>
                    </span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 flex justify-between font-extrabold text-2xl">
                <span>Total</span>
                <span className="text-orange-600">₹{totalAmount}</span>
              </div>
              <Button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 font-bold text-lg py-8 rounded-2xl mt-4"
              >
                {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
