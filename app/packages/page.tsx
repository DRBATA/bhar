'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PackageBookingModal } from '@/components/modals/package-booking-modal'

interface Drink {
  id: string
  name: string
  description: string
}

interface PackageDrink {
  drink: Drink
  quantity: number
}

interface Package {
  id: string
  name: string
  description: string
  memberPrice: number
  nonMemberPrice: number
  drinks: PackageDrink[]
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchPackages = async () => {
      try {
        console.log('Fetching packages from client...')
        const response = await fetch('/api/packages')
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('API error:', errorData)
          throw new Error(errorData.message || 'Failed to fetch packages')
        }

        const data = await response.json()
        console.log('Received packages:', data)
        
        if (mounted) {
          setPackages(data)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
        if (mounted) {
          setError(error instanceof Error ? error.message : 'Failed to load packages')
          setLoading(false)
        }
      }
    }

    fetchPackages()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p className="text-white/60">Loading packages...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-miami-coral hover:bg-miami-coral/90"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!packages || packages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="text-center">
          <p className="text-white/60">No packages available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Experience
          </h1>
          <p className="text-xl text-white/60">
            Select a package to enjoy our premium water bar service
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-colors"
            >
              {/* Package Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {pkg.name}
                </h2>
                <p className="text-white/60 mb-4">
                  {pkg.description}
                </p>
                <p className="text-3xl font-bold text-miami-coral">
                  {pkg.memberPrice} AED
                </p>
              </div>

              {/* Drink List */}
              <div className="space-y-4 mb-8">
                {pkg.drinks.map((drink) => (
                  <div
                    key={drink.drink.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-white">
                      {drink.drink.name}
                    </span>
                    <span className="text-white/60">
                      {drink.quantity === -1 ? 'Unlimited' : `${drink.quantity}x`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Book Button */}
              <Button
                className="w-full bg-miami-coral hover:bg-miami-coral/90"
                onClick={() => setSelectedPackage(pkg)}
              >
                Book Now
              </Button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center text-white/60">
          <p>All packages are valid for one day only</p>
          <p>Drinks must be consumed during your visit</p>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedPackage && (
        <PackageBookingModal
          isOpen={!!selectedPackage}
          onClose={() => setSelectedPackage(null)}
          package={selectedPackage}
        />
      )}
    </div>
  )
}
