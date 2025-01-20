'use client'

import { useState } from 'react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  session: {
    id: string
    date: Date
    isWeekend: boolean
    availableSlots: number
    iceSlots: number
    reflexSlots: number
  }
}

export function BookingModal({ isOpen, onClose, session }: BookingModalProps) {
  const [drinkPackage, setDrinkPackage] = useState('NONE')
  const [wantIceBath, setWantIceBath] = useState(false)
  const [wantReflexology, setWantReflexology] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Book Session</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="space-y-4">
          {/* Session Info */}
          <div>
            <h3 className="font-medium">
              {new Date(session.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <p className="text-gray-600">
              {session.isWeekend ? '9:00 AM - 12:00 PM' : '6:00 AM - 9:00 AM'}
            </p>
          </div>

          {/* Drink Package Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Drink Package</label>
            <select 
              value={drinkPackage}
              onChange={(e) => setDrinkPackage(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="NONE">No drinks</option>
              <option value="BASIC">Basic Package (2 drinks) - 25 USD</option>
              <option value="PREMIUM">Premium Package (4 drinks) - 45 USD</option>
            </select>
          </div>

          {/* Add-ons */}
          {session.iceSlots > 0 && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="iceBath"
                checked={wantIceBath}
                onChange={(e) => setWantIceBath(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="iceBath">
                Add Ice Bath (25 USD)
              </label>
            </div>
          )}

          {session.reflexSlots > 0 && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="reflexology"
                checked={wantReflexology}
                onChange={(e) => setWantReflexology(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="reflexology">
                Add Reflexology (25 USD)
              </label>
            </div>
          )}

          {/* Book Button */}
          <button 
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              // Will handle booking submission
              onClose()
            }}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  )
}
