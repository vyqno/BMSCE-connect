'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase'
import { Profile, Canteen } from '@/types'
import { LayoutDashboard, ShoppingBag, BarChart3, LogOut, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading: authLoading, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [canteen, setCanteen] = useState<Canteen | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const canteenId = params.canteenId as string
  const supabase = createClient()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/')
      return
    }

    async function checkAdmin() {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (!profileData || profileData.role !== 'admin' || (canteenId && profileData.admin_canteen_id !== canteenId)) {
        router.push('/')
        return
      }

      setProfile(profileData as any)

      if (profileData.admin_canteen_id) {
        const { data: canteenData } = await supabase
          .from('canteens')
          .select('*')
          .eq('id', profileData.admin_canteen_id)
          .single()
        setCanteen(canteenData)
      }

      setLoading(false)
    }

    checkAdmin()
  }, [user, authLoading, router, canteenId])

  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6">
          <Link href={`/admin/${canteenId}`} className="flex flex-col">
            <span className="text-xl font-bold text-orange-600">Admin Panel</span>
            <span className="text-sm font-medium text-gray-500">{canteen?.name || 'Loading...'}</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/admin/${canteenId}`}>
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          <Link href={`/admin/${canteenId}/analytics`}>
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
