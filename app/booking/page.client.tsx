'use client'

import { useState } from 'react'
import { Session } from 'next-auth'
import { YachtSessionWithAvailability } from './page.server'
import { BookingModal } from './booking-modal'

interface BookingDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

function BookingDrawer({ isOpen, onClose, children }: BookingDrawerProps) {
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
      {children}
    </div>
  )
}

interface BookingPageClientProps {
  sessions: YachtSessionWithAvailability[]
  userSession: Session | null
}

export function BookingPageClient({ sessions, userSession }: BookingPageClientProps) {
  const [selectedSession, setSelectedSession] = useState<YachtSessionWithAvailability | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Book Your Yacht Experience</h1>

      {/* Session Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white rounded-lg shadow p-6">
            {/* Date and Time */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {new Date(session.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              <p className="text-gray-600">
                {session.isWeekend ? '9:00 AM - 12:00 PM' : '6:00 AM - 9:00 AM'}
              </p>
            </div>

            {/* Availability */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Yacht Slots:</span>
                <span className="font-medium">
                  {session.availableSlots}/{session.capacity}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ice Bath:</span>
                <span className="font-medium">
                  {session.iceSlots} slots available
                </span>
              </div>
              <div className="flex justify-between">
                <span>Reflexology:</span>
                <span className="font-medium">
                  {session.reflexSlots} slots available
                </span>
              </div>
            </div>

            {/* Booking Button */}
            <button 
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setSelectedSession(session)}
              aria-label={`Book session for ${new Date(session.date).toLocaleDateString()}`}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedSession && (
        <BookingModal
          isOpen={true}
          onClose={() => setSelectedSession(null)}
          session={selectedSession}
        />
      )}

      {/* Drawer Button (only for logged-in users) */}
      {userSession && (
        <>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600"
            aria-label="View your bookings"
          >
            View Bookings
          </button>
          <BookingDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)}
          >
            {/* Drawer content */}
            <p className="text-gray-600">Your bookings will appear here</p>
          </BookingDrawer>
        </>
      )}
    </div>
  )
}
