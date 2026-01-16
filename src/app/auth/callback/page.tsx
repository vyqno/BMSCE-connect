'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleAuth = async () => {
      const { error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error during auth callback:', error.message)
      }
      router.push('/welcome')
    }

    handleAuth()
  }, [router, supabase])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-500">Signing you in...</p>
      </div>
    </div>
  )
}
