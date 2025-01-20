'use client'

import { useState } from 'react'
import { DrinkPackage } from '@prisma/client'

interface PackageOption {
  id: string
  name: string
  description: string
  price: {
    usd: number
    aed: number
  }
  sessions: number
}

interface AddOn {
  type: 'ICE_BATH' | 'REFLEXOLOGY'
  name: string
  description: string
  price: {
    usd: number
    aed: number
    memberUsd: number
    memberAed: number
  }
  availableSlots: number
}

interface SelectPackageProps {
  isMember: boolean
  sessionDate: Date
  iceSlots: number
  reflexSlots: number
  onComplete: (selection: {
    packageType?: string
    drinkPackage: DrinkPackage | null
    addOns: {
      iceBath: boolean
      reflexology: boolean
    }
  }) => void
}

const PACKAGES: PackageOption[] = [
  {
    id: 'one-off',
    name: 'Single Session',
    description: 'One yacht session',
    price: { usd: 40, aed: 150 },
    sessions: 1
  },
  {
    id: 'bi-weekly',
    name: 'Bi-Weekly Package',
    description: '6 sessions over 2 weeks',
    price: { usd: 120, aed: 440 },
    sessions: 6
  }
]

const ADD_ONS: AddOn[] = [
  {
    type: 'ICE_BATH',
    name: 'Ice Bath',
    description: '20-minute session',
    price: {
      usd: 25,
      aed: 90,
      memberUsd: 15,
      memberAed: 55
    },
    availableSlots: 9
  },
  {
    type: 'REFLEXOLOGY',
    name: 'Reflexology',
    description: '20-minute session',
    price: {
      usd: 25,
      aed: 90,
      memberUsd: 15,
      memberAed: 55
    },
    availableSlots: 9
  }
]

export function SelectPackage({ isMember, sessionDate, iceSlots, reflexSlots, onComplete }: SelectPackageProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>()
  const [drinkPackage, setDrinkPackage] = useState<DrinkPackage | null>(null)
  const [addOns, setAddOns] = useState({
    iceBath: false,
    reflexology: false
  })

  // Only show package selection for non-members
  const showPackages = !isMember

  return (
    <div className="space-y-8">
      {/* Package Selection for Non-Members */}
      {showPackages && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Select Package</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PACKAGES.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  selectedPackage === pkg.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="font-medium">{pkg.name}</div>
                <div className="text-sm text-gray-600 mt-1">{pkg.description}</div>
                <div className="text-sm font-medium mt-2">
                  ${pkg.price.usd} / {pkg.price.aed} AED
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Drink Package Selection */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Drink Package</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setDrinkPackage(null)}
            className={`p-4 rounded-lg border text-left transition-colors ${
              drinkPackage === null
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="font-medium">No Drinks</div>
            <div className="text-sm text-gray-600 mt-1">Skip drink package</div>
          </button>
          <button
            onClick={() => setDrinkPackage(DrinkPackage.BASIC)}
            className={`p-4 rounded-lg border text-left transition-colors ${
              drinkPackage === DrinkPackage.BASIC
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="font-medium">Basic Package</div>
            <div className="text-sm text-gray-600 mt-1">2 Drinks</div>
            <div className="text-sm font-medium mt-2">
              ${isMember ? 20 : 25} / {isMember ? 75 : 90} AED
            </div>
          </button>
          <button
            onClick={() => setDrinkPackage(DrinkPackage.PREMIUM)}
            className={`p-4 rounded-lg border text-left transition-colors ${
              drinkPackage === DrinkPackage.PREMIUM
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="font-medium">Premium Package</div>
            <div className="text-sm text-gray-600 mt-1">4 Drinks</div>
            <div className="text-sm font-medium mt-2">
              ${isMember ? 40 : 45} / {isMember ? 150 : 165} AED
            </div>
          </button>
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Add-ons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ADD_ONS.map(addon => {
            const slots = addon.type === 'ICE_BATH' ? iceSlots : reflexSlots
            const isSelected = addon.type === 'ICE_BATH' ? addOns.iceBath : addOns.reflexology

            return (
              <button
                key={addon.type}
                onClick={() => setAddOns(prev => ({
                  ...prev,
                  [addon.type === 'ICE_BATH' ? 'iceBath' : 'reflexology']: !isSelected
                }))}
                disabled={slots === 0}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                } ${slots === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="font-medium">{addon.name}</div>
                <div className="text-sm text-gray-600 mt-1">{addon.description}</div>
                <div className="text-sm font-medium mt-2">
                  ${isMember ? addon.price.memberUsd : addon.price.usd} / 
                  {isMember ? addon.price.memberAed : addon.price.aed} AED
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {slots} slots available
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => onComplete({
          packageType: showPackages ? selectedPackage : undefined,
          drinkPackage,
          addOns
        })}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Continue to Payment
      </button>
    </div>
  )
}
