import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, MenuItem } from '@/types'
import { toast } from 'sonner'

interface CartState {
  items: CartItem[]
  addItem: (item: MenuItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = [...get().items]
        
        if (currentItems.length > 0 && currentItems[0].canteen_id !== item.canteen_id) {
          toast.info('Cart cleared! New canteen selected. 🍱');
          set({ items: [{ ...item, quantity: 1 }] })
          return
        }

        const existingItemIndex = currentItems.findIndex((i) => i.id === item.id)

        if (existingItemIndex > -1) {
          currentItems[existingItemIndex] = {
            ...currentItems[existingItemIndex],
            quantity: currentItems[existingItemIndex].quantity + 1
          }
          set({ items: currentItems })
        } else {
          set({ items: [...currentItems, { ...item, quantity: 1 }] })
        }
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) })
      },
      updateQuantity: (itemId, quantity) => {
        const currentItems = [...get().items]
        const itemIndex = currentItems.findIndex(i => i.id === itemId)
        
        if (itemIndex > -1) {
          if (quantity <= 0) {
            set({ items: currentItems.filter(i => i.id !== itemId) })
          } else {
            currentItems[itemIndex] = { ...currentItems[itemIndex], quantity }
            set({ items: currentItems })
          }
        }
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
)
