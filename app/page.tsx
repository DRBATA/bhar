'use client'

import { WellnessCarousel } from '@/components/wellness-carousel'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-miami-sky-light to-miami-sky">
      {/* Hero Section */}
      <div className="relative h-[80vh] overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/boat.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-miami-sky-dark/50 to-miami-sky/70 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-medium tracking-wide text-white drop-shadow-lg mb-6">
            Morning Wellness <br />
            on the Water
          </h1>
          <p className="text-xl text-white/90 font-medium max-w-2xl mb-8">
            Join us for sunrise yoga, meditation, ice baths, and more. 
            Experience wellness in a whole new way with our morning 
            parties on a luxury yacht.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/booking">
              <Button className="bg-gradient-to-r from-miami-coral to-miami-coral-dark hover:opacity-90 text-white font-medium tracking-wide shadow-lg px-8 py-6 text-lg">
                Book Your Experience
              </Button>
            </Link>
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white font-medium tracking-wide shadow-lg px-8 py-6 text-lg backdrop-blur-sm"
              onClick={() => {
                const element = document.getElementById('experiences')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Experiences Section */}
      <div id="experiences" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-medium tracking-wide text-miami-coral-dark drop-shadow-md mb-4">
              Wellness Experiences
            </h2>
            <p className="text-miami-coral-dark/90 font-medium max-w-2xl mx-auto">
              From energizing workouts to peaceful meditation, our yacht offers 
              a variety of wellness experiences to start your day right.
            </p>
          </div>

          {/* Carousel */}
          <WellnessCarousel />
        </div>
      </div>

      {/* Membership Benefits */}
      <div className="py-20 px-4 bg-gradient-to-br from-miami-coral/10 to-miami-sky/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-medium tracking-wide text-miami-coral-dark drop-shadow-md mb-4">
              Member Benefits
            </h2>
            <p className="text-miami-coral-dark/90 font-medium max-w-2xl mx-auto">
              Join our wellness community and enjoy exclusive perks and discounts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Booking Benefits */}
            <div className="p-6 rounded-lg bg-white/20 border border-white/30 backdrop-blur-md shadow-xl">
              <h3 className="text-xl font-medium text-miami-coral-dark mb-4">
                Flexible Booking
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Unlimited bookings</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Priority access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Easy rescheduling</span>
                </li>
              </ul>
            </div>

            {/* Experience Benefits */}
            <div className="p-6 rounded-lg bg-white/20 border border-white/30 backdrop-blur-md shadow-xl">
              <h3 className="text-xl font-medium text-miami-coral-dark mb-4">
                Experience Perks
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">20% off all experiences</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Member-only sessions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Personal wellness tracking</span>
                </li>
              </ul>
            </div>

            {/* Drink Benefits */}
            <div className="p-6 rounded-lg bg-white/20 border border-white/30 backdrop-blur-md shadow-xl">
              <h3 className="text-xl font-medium text-miami-coral-dark mb-4">
                Water Bar Perks
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">15% off all drinks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Exclusive recipes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Monthly tastings</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/booking">
              <Button className="bg-gradient-to-r from-miami-coral to-miami-coral-dark hover:opacity-90 text-white font-medium tracking-wide shadow-lg px-8 py-6 text-lg">
                Join Now - 550 AED/month
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
