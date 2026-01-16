import { Menu } from '@/components/Menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag, Star, Zap, MapPin } from 'lucide-react'

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-orange-600 py-28 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-6 gap-8 rotate-12 -translate-y-20">
            {[...Array(24)].map((_, i) => (
              <ShoppingBag key={i} className="w-24 h-24 text-white" />
            ))}
          </div>
        </div>
        
        <div className="container relative z-10 px-4 sm:px-8 mx-auto">
          <div className="max-w-3xl text-white">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 font-outfit leading-none">
              Skip the Queue, <br />
              <span className="text-orange-200">Savor the Food.</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-50/90 mb-12 leading-relaxed font-medium max-w-xl">
              BMSCE Canteen Connect brings your favorite campus food to your fingertips. 
              Order from any canteen and pickup when it's piping hot.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/canteens">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-black text-xl px-12 py-8 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-orange-900/20">
                  Choose Your Canteen
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 right-0 w-1/3 h-full hidden lg:block">
           <div className="w-full h-full bg-gradient-to-l from-orange-500/20 to-transparent" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container px-4 sm:px-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center shadow-sm">
                <Zap className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-black font-outfit">Fast Ordering</h3>
              <p className="text-gray-500 font-medium leading-relaxed uppercase text-xs tracking-widest">No more standing in lines</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center shadow-sm">
                <Star className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-black font-outfit">Top Quality</h3>
              <p className="text-gray-500 font-medium leading-relaxed uppercase text-xs tracking-widest">Freshly prepared and hot</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center shadow-sm">
                <MapPin className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-black font-outfit">Smart Alert</h3>
              <p className="text-gray-500 font-medium leading-relaxed uppercase text-xs tracking-widest">Get notified when ready</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
