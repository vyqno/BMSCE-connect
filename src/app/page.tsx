'use client'

import { BackgroundGlow } from "@/components/ui/background-components"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function RootLoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/welcome')
    }
  }, [user, loading, router])

  if (loading || user) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="h-12 w-12 animate-spin rounded-full border-4 border-orange-600 border-t-transparent"
        />
      </div>
    )
  }

  return (
    <BackgroundGlow>
      <div className="flex h-screen flex-col items-center justify-center text-center px-4 relative z-10 overflow-hidden">
        {/* Subtle Decorative Elements */}
        <motion.div 
          animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-200/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 30, 0], y: [0, 30, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-[120px]" 
        />
        
        <AnimatePresence>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl space-y-6 md:space-y-8"
          >
            <div className="relative group p-8 md:p-12 bg-orange-50/50 rounded-[3rem] border border-orange-100/50 backdrop-blur-sm shadow-[0_20px_60px_rgba(234,88,12,0.05)]">
              {/* Decorative side accent */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-20 bg-orange-400 rounded-r-full opacity-40" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-20 bg-orange-400 rounded-l-full opacity-40" />

              <div className="space-y-4 relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 font-outfit leading-[0.85]">
                    Welcome to <br />
                    <span className="text-orange-600 drop-shadow-sm">Canteen Connect</span>
                  </h1>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto font-medium leading-relaxed"
                >
                  Skip the queue and savor the food. <br />
                  Your campus favorites, just a click away.
                </motion.p>
              </div>
            </div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
              className="flex justify-center"
            >
              <Button 
                onClick={() => signInWithGoogle()}
                className="group relative bg-white text-orange-600 hover:bg-orange-600 hover:text-white font-black text-xl px-12 py-8 rounded-full shadow-[0_20px_40px_rgba(234,88,12,0.15)] border-2 border-orange-50 flex items-center gap-5 transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 bg-white p-2 rounded-full shadow-sm shadow-orange-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                </div>
                <span className="relative z-10 tracking-tight">Sign in with Google</span>
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Minimal Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 text-gray-400 font-semibold tracking-[0.3em] uppercase text-[10px]"
        >
          BMS College of Engineering • Campus Dining
        </motion.div>
      </div>
    </BackgroundGlow>
  )
}
