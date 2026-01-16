'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useCart } from '@/hooks/use-cart'
import { createClient } from '@/lib/supabase'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export function Navbar() {
  const { user, signOut } = useAuth()
  const items = useCart((state) => state.items)
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const [adminCanteenId, setAdminCanteenId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setAdminCanteenId(null)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, admin_canteen_id')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin' && profile?.admin_canteen_id) {
        setAdminCanteenId(profile.admin_canteen_id)
      } else {
        setAdminCanteenId(null)
      }
    }

    checkAdminStatus()
  }, [user])

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-6 md:px-12">
        <Link href="/welcome" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-orange-600">BMSCE</span>
          <span className="text-xl font-medium hidden sm:inline-block font-outfit tracking-tight">Canteen Connect</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user && (
            <Link href="/cart">
              <div className="relative group">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-xl border-orange-100 text-orange-600 hover:bg-orange-50 transition-all font-bold"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                {totalItemCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 flex items-center justify-center p-1 rounded-full bg-orange-600 text-white text-[10px] font-black border-2 border-white shadow-sm pointer-events-none">
                    {totalItemCount}
                  </Badge>
                )}
              </div>
            </Link>
          )}

          {/* Admin Button - Only visible for admins */}
          {user && adminCanteenId && (
            <Link href={`/admin/${adminCanteenId}`}>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-xl border-orange-100 text-orange-600 hover:bg-orange-50 transition-all font-bold"
                title="Admin Panel"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                {adminCanteenId && (
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/${adminCanteenId}`}>
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
