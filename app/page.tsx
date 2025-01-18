'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/wellness/boat back.webp')` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[1px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Navigation */}
        <nav className="absolute top-0 right-0 p-6 flex gap-4">
          <Link href="/drinks">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Drinks Menu
            </Button>
          </Link>
          <Link href="/booking">
            <Button className="bg-rose-500 hover:bg-rose-600 text-white">
              Book Now
            </Button>
          </Link>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-32">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100">
              Morning Wellness on the Water
            </h1>
            <p className="text-xl text-gray-300 mb-4 max-w-2xl">
              Join us for sunrise yoga, meditation, ice baths, and more. Experience 
              wellness in a whole new way with our morning parties on a luxury yacht.
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl">
              Located at Dubai Creek, where modern wellness meets stunning waterfront views. 
              Perfect for early risers and wellness enthusiasts seeking a unique morning experience.
            </p>
            <div className="flex gap-4">
              <Link href="/booking">
                <Button 
                  className="bg-rose-500 hover:bg-rose-600 text-white text-lg px-8 py-6
                    shadow-lg shadow-rose-500/20 transition-all duration-300 
                    hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-100"
                >
                  Book Your Experience
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="text-white border-white/20 hover:bg-white/10 text-lg px-8 py-6"
                onClick={() => toast({
                  title: "Coming Soon",
                  description: "Full package details will be available soon. Check back later!",
                })}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-24">
          <h2 className="text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100">
            Wellness Experiences
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Sunrise Yacht Sessions',
                description: 'Start your day with a 3-hour wellness experience on our luxury yacht at Dubai Creek. Perfect for early risers seeking tranquility.',
              },
              {
                title: 'Curated Activities',
                description: 'Choose from yoga, meditation, or functional fitness. Each session is designed to energize your morning and set the tone for your day.',
              },
              {
                title: 'Premium Experiences',
                description: 'Enhance your morning with ice baths, reflexology, and our signature adaptogenic drinks. Customize your wellness journey.',
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-black/20 backdrop-blur-xl rounded-xl p-6 border border-white/10
                  hover:border-white/20 transition-all duration-300 hover:shadow-2xl 
                  hover:shadow-rose-500/10 hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
