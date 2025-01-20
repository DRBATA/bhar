'use client'

import { useState } from 'react'
import { DrinkPackage } from '@prisma/client'

interface Session {
  id: string
  date: Date
  isWeekend: boolean
  availableSlots: number
  iceSlots: number
  reflexSlots: number
}

interface SelectSessionProps {
  sessions: Session[]
  onSelect: (sessionId: string) => void
  isMember: boolean
}

export function SelectSession({ sessions, onSelect, isMember }: SelectSessionProps) {
  const [selectedDate, setSelectedDate] = useState<string>()
  
  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = new Date(session.date).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(session)
    return acc
  }, {} as Record<string, Session[]>)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Select Your Session</h2>
      
      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(sessionsByDate).map(([date, dateSessions]) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`p-4 rounded-lg border transition-colors ${
              selectedDate === date 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="font-medium">
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {dateSessions[0].isWeekend ? '9:00 AM - 12:00 PM' : '6:00 AM - 9:00 AM'}
            </div>
            <div className="text-sm text-gray-600">
              {dateSessions[0].availableSlots} slots available
            </div>
          </button>
        ))}
      </div>

      {/* Session Details */}
      {selectedDate && sessionsByDate[selectedDate] && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Session Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Time</span>
              <span>
                {sessionsByDate[selectedDate][0].isWeekend 
                  ? '9:00 AM - 12:00 PM' 
                  : '6:00 AM - 9:00 AM'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Available Slots</span>
              <span>{sessionsByDate[selectedDate][0].availableSlots}</span>
            </div>
            <div className="flex justify-between">
              <span>Ice Bath Slots</span>
              <span>{sessionsByDate[selectedDate][0].iceSlots} available</span>
            </div>
            <div className="flex justify-between">
              <span>Reflexology Slots</span>
              <span>{sessionsByDate[selectedDate][0].reflexSlots} available</span>
            </div>

            {/* Booking restrictions */}
            {!isMember && (
              <div className="text-sm text-gray-500 mt-4">
                Note: Non-members must book 6 sessions in advance
              </div>
            )}

            <button
              onClick={() => onSelect(sessionsByDate[selectedDate][0].id)}
              className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Select This Session
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
