'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'

export function CartSync() {
  const { user, loading } = useAuth()
  const { clearCart } = useCart()

  useEffect(() => {
    if (!loading && !user) {
      clearCart()
    }
  }, [user, loading, clearCart])

  return null
}
