'use client'

import { DrinkRedeem } from './drink-redeem'
import { DrinkPackage } from '@prisma/client'

interface MemberDrawerProps {
  isOpen: boolean
  onClose: () => void
  bookings: Array<{
    id: string
    date: Date
    startTime: string
    endTime: string
    drinkPackage: DrinkPackage | null
  }>
}

export function MemberDrawer({ isOpen, onClose, bookings }: MemberDrawerProps) {
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl p-6 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Yacht Club Charter</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close drawer"
        >
          ×
        </button>
      </div>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-gray-50 rounded-lg p-4">
            <div className="mb-3">
              <h3 className="font-medium">
                {new Date(booking.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <p className="text-sm text-gray-600">
                {booking.startTime} - {booking.endTime}
              </p>
            </div>

            {/* Reusing our drink redemption component */}
            {booking.drinkPackage && (
              <DrinkRedeem 
                drinkPackage={booking.drinkPackage}
                date={booking.date}
              />
            )}
          </div>
        ))}

        {bookings.length === 0 && (
          <p className="text-gray-600 text-center">No bookings yet</p>
        )}
      </div>
    </div>
  )
}
