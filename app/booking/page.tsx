'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

interface Package {
  id: string
  name: string
  duration: string
  slots: string
  priceAED: number
  priceUSD: number
  features: string[]
}

const packages: Package[] = [
  {
    id: 'day',
    name: 'Day Pass',
    duration: '1 day',
    slots: '1 booking',
    priceAED: 110,
    priceUSD: 30,
    features: [
      '1 morning yacht session',
      'Access to daily wellness activity',
      'Regular pricing for drinks',
      'Regular pricing for add-ons',
      'Single booking only',
      'Valid for selected date'
    ]
  },
  {
    id: 'week1',
    name: '1 Week Pass',
    duration: '7 days',
    slots: '3 bookings',
    priceAED: 220,
    priceUSD: 60,
    features: [
      '3 morning yacht sessions',
      'Must book all slots at once',
      'Access to daily wellness activities',
      'Regular pricing for drinks',
      'Regular pricing for add-ons',
      'Valid for 7 days'
    ]
  },
  {
    id: 'week2',
    name: '2 Week Pass',
    duration: '14 days',
    slots: '6 bookings',
    priceAED: 370,
    priceUSD: 100,
    features: [
      '6 morning yacht sessions',
      'Must book all slots at once',
      'Access to daily wellness activities',
      'Regular pricing for drinks',
      'Regular pricing for add-ons',
      'Valid for 14 days'
    ]
  },
  {
    id: 'member',
    name: 'Monthly Subscription',
    duration: '30 days',
    slots: 'Up to 3 active',
    priceAED: 550,
    priceUSD: 150,
    features: [
      'Up to 3 active bookings',
      'Book new slots as you go',
      'Access to daily wellness activities',
      '1/3 off all experiences',
      'Regular pricing for drinks',
      'Regular pricing for add-ons'
    ]
  }
]

export default function BookingPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-rose-900/20">
      <div className="absolute inset-0 bg-[url('/drinks/drinks.webp')] bg-cover bg-center opacity-10" />
      
      <div className="relative z-10 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100 mb-4">
              Choose Your Package
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Join our exclusive wellness community with flexible booking options. 
              Experience morning yacht sessions, wellness activities, premium drinks, 
              and optional add-ons.
            </p>
          </div>

          {/* Packages Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`
                  relative p-6 rounded-xl border backdrop-blur-xl shadow-xl overflow-hidden
                  transition-all duration-300 hover:-translate-y-1
                  ${selectedPackage === pkg.id 
                    ? 'bg-black/40 border-rose-500/50 shadow-rose-500/20' 
                    : 'bg-black/20 border-white/10 hover:bg-black/30 hover:border-white/20'
                  }
                `}
              >
                {/* Accent Glow */}
                <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl" />
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold tracking-wide text-white mb-2">
                    {pkg.name}
                  </h3>
                  <div className="flex flex-col mb-4">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-rose-300 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                        {pkg.priceAED} AED
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      (${pkg.priceUSD} USD)
                    </span>
                  </div>
                  <div className="text-gray-300 mb-4">
                    <div className="font-medium">{pkg.duration}</div>
                    <div className="font-medium">{pkg.slots}</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-rose-400 mt-1">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`
                      w-full font-medium tracking-wide shadow-lg transition-all duration-300
                      ${selectedPackage === pkg.id
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                        : 'bg-white/5 text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Next Step Button */}
          {selectedPackage && (
            <div className="mt-12 text-center">
              <Button
                className="bg-rose-500 hover:bg-rose-600 text-white font-medium tracking-wide 
                  shadow-lg shadow-rose-500/20 px-8 py-6 text-lg transition-all duration-300
                  hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-100"
              >
                Continue to Select Dates
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
