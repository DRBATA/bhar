'use client'

import { useState } from 'react'
import { DrinkPackage } from '@prisma/client'

interface DrinkRedeemProps {
  drinkPackage: DrinkPackage
  date: Date
}

export function DrinkRedeem({ drinkPackage, date }: DrinkRedeemProps) {
  const [redeemed, setRedeemed] = useState(false)
  const [redeemedTime, setRedeemedTime] = useState<string>()
  
  const isToday = new Date(date).toDateString() === new Date().toDateString()

  // Return null if no drink package or not today's session
  if (!drinkPackage || !isToday) return null

  const drinkCount = drinkPackage === DrinkPackage.PREMIUM ? 4 : 2

  return (
    <div className="mt-4 p-4 border rounded-lg bg-white">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Drink Package</h3>
          <p className="text-sm text-gray-600">
            {drinkCount} Drinks
          </p>
        </div>
        
        {!redeemed ? (
          <button
            onClick={() => {
              const time = new Date().toLocaleTimeString()
              setRedeemedTime(time)
              setRedeemed(true)
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tap to Redeem
          </button>
        ) : (
          <div className="text-sm text-gray-500">
            ✓ Used at {redeemedTime}
          </div>
        )}
      </div>
    </div>
  )
}
