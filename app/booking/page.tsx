'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

interface Package {
  id: string
  name: string
  duration: string
  slots: string
  price: number
  features: string[]
}

const packages: Package[] = [
  {
    id: 'week1',
    name: '1 Week Pass',
    duration: '7 days',
    slots: '1-3 bookings',
    price: 1500,
    features: [
      'Book up to 3 morning parties',
      'Must book all slots at once',
      'Standard pricing for experiences',
      'Standard pricing for drinks',
      'Single confirmation email',
      'Valid for 7 days'
    ]
  },
  {
    id: 'week2',
    name: '2 Week Pass',
    duration: '14 days',
    slots: '3-6 bookings',
    price: 2700,
    features: [
      'Book up to 6 morning parties',
      'Must book all slots at once',
      'Standard pricing for experiences',
      'Standard pricing for drinks',
      'Single confirmation email',
      'Valid for 14 days'
    ]
  },
  {
    id: 'member',
    name: 'Monthly Membership',
    duration: '30 days',
    slots: 'Unlimited',
    price: 550,
    features: [
      'Unlimited morning parties',
      'Book anytime',
      '20% off all experiences',
      '15% off all drinks',
      'Member dashboard access',
      'Auto-renews monthly'
    ]
  }
]

export default function BookingPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-miami-sky-light to-miami-sky px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-medium tracking-wide text-miami-coral-dark drop-shadow-md mb-4">
            Choose Your Morning Party Package
          </h1>
          <p className="text-miami-coral-dark/90 font-medium max-w-2xl mx-auto">
            Join our exclusive wellness community with flexible booking options. 
            Whether you're visiting for a week or becoming a regular member, 
            we have the perfect package for your morning wellness journey.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`
                relative p-6 rounded-lg border backdrop-blur-md shadow-xl overflow-hidden
                ${selectedPackage === pkg.id 
                  ? 'bg-white/30 border-miami-coral' 
                  : 'bg-white/20 border-white/30 hover:bg-white/25 transition-colors'
                }
              `}
            >
              {/* Geometric Accent */}
              <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-miami-sky/20 blur-xl" />
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-medium tracking-wide text-miami-coral-dark mb-2">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-miami-coral-dark">
                    {pkg.price}
                  </span>
                  <span className="text-miami-coral-dark/80 ml-2">
                    AED/{pkg.id === 'member' ? 'month' : 'pass'}
                  </span>
                </div>
                <div className="text-miami-coral-dark/90 mb-4">
                  <div className="font-medium">{pkg.duration}</div>
                  <div className="font-medium">{pkg.slots}</div>
                </div>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="text-miami-coral-dark">✓</span>
                      <span className="text-miami-coral-dark/90 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`
                    w-full font-medium tracking-wide shadow-lg
                    ${selectedPackage === pkg.id
                      ? 'bg-gradient-to-r from-miami-coral to-miami-coral-dark text-white'
                      : 'bg-white/20 text-miami-coral-dark hover:bg-white/30'
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
          <div className="mt-8 text-center">
            <Button
              className="bg-gradient-to-r from-miami-coral to-miami-coral-dark hover:opacity-90 text-white font-medium tracking-wide shadow-lg px-8 py-6 text-lg"
            >
              Continue to Booking
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
