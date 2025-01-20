'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SelectSession } from './select-session'
import { SelectPackage } from './select-package'
import { DrinkPackage } from '@prisma/client'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from '@/components/ui/use-toast'

type BookingStep = 'SELECT_SESSION' | 'SELECT_PACKAGE' | 'PAYMENT'

interface BookingState {
  sessionId?: string
  packageType?: string
  drinkPackage: DrinkPackage | null
  addOns: {
    iceBath: boolean
    reflexology: boolean
  }
}

export default function BookingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState<BookingStep>('SELECT_SESSION')
  const [isLoading, setIsLoading] = useState(false)
  const [booking, setBooking] = useState<BookingState>({
    drinkPackage: null,
    addOns: {
      iceBath: false,
      reflexology: false
    }
  })

  // Mock user data - in real app, get from session
  const isMember = false

  // Mock session data - in real app, fetch from API
  const sessions = [
    {
      id: '1',
      date: new Date('2024-02-01'),
      isWeekend: false,
      availableSlots: 50,
      iceSlots: 5,
      reflexSlots: 3
    },
    {
      id: '2',
      date: new Date('2024-02-02'),
      isWeekend: false,
      availableSlots: 75,
      iceSlots: 9,
      reflexSlots: 6
    },
    {
      id: '3',
      date: new Date('2024-02-03'),
      isWeekend: true,
      availableSlots: 100,
      iceSlots: 9,
      reflexSlots: 9
    }
  ]

  const handleSessionSelect = (sessionId: string) => {
    try {
      setBooking(prev => ({ ...prev, sessionId }))
      setStep('SELECT_PACKAGE')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to select session. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handlePackageSelect = (selection: {
    packageType?: string
    drinkPackage: DrinkPackage | null
    addOns: {
      iceBath: boolean
      reflexology: boolean
    }
  }) => {
    try {
      setBooking(prev => ({
        ...prev,
        ...selection
      }))
      setStep('PAYMENT')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to select package. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
      })

      if (!response.ok) {
        throw new Error('Booking failed')
      }

      const data = await response.json()
      router.push(`/booking/success/${data.id}`)
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: 'Payment Failed',
        description: 'There was a problem processing your payment. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate total price
  const calculatePrice = () => {
    let total = 0
    const selectedSession = sessions.find(s => s.id === booking.sessionId)
    
    if (!selectedSession) return { usd: 0, aed: 0 }

    // Base price
    if (isMember) {
      // Members get sessions included
      total = 0
    } else if (booking.packageType === 'bi-weekly') {
      total = 120 // $120 for 6 sessions
    } else {
      total = 40 // $40 for single session
    }

    // Drink package
    if (booking.drinkPackage === DrinkPackage.PREMIUM) {
      total += isMember ? 40 : 45
    } else if (booking.drinkPackage === DrinkPackage.BASIC) {
      total += isMember ? 20 : 25
    }

    // Add-ons
    if (booking.addOns.iceBath) {
      total += isMember ? 15 : 25
    }
    if (booking.addOns.reflexology) {
      total += isMember ? 15 : 25
    }

    return {
      usd: total,
      aed: total * 3.67 // Convert to AED
    }
  }

  const price = calculatePrice()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12">
            <LoadingSpinner />
          </div>
          <p className="mt-4 text-gray-600">Processing your booking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
            step === 'SELECT_SESSION' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}>1</div>
          <div className="h-1 w-16 bg-gray-200" />
          <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
            step === 'SELECT_PACKAGE' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}>2</div>
          <div className="h-1 w-16 bg-gray-200" />
          <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
            step === 'PAYMENT' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}>3</div>
        </div>
      </div>

      {/* Current Step */}
      {step === 'SELECT_SESSION' && (
        <SelectSession
          sessions={sessions}
          onSelect={handleSessionSelect}
          isMember={isMember}
        />
      )}

      {step === 'SELECT_PACKAGE' && booking.sessionId && (
        <SelectPackage
          isMember={isMember}
          sessionDate={sessions.find(s => s.id === booking.sessionId)!.date}
          iceSlots={sessions.find(s => s.id === booking.sessionId)!.iceSlots}
          reflexSlots={sessions.find(s => s.id === booking.sessionId)!.reflexSlots}
          onComplete={handlePackageSelect}
        />
      )}

      {step === 'PAYMENT' && (
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6">Payment</h2>
          
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Session Package</span>
                <span>${booking.packageType === 'bi-weekly' ? '120' : '40'}</span>
              </div>
              {booking.drinkPackage && (
                <div className="flex justify-between">
                  <span>Drink Package</span>
                  <span>
                    ${booking.drinkPackage === DrinkPackage.PREMIUM 
                      ? (isMember ? '40' : '45')
                      : (isMember ? '20' : '25')
                    }
                  </span>
                </div>
              )}
              {booking.addOns.iceBath && (
                <div className="flex justify-between">
                  <span>Ice Bath</span>
                  <span>${isMember ? '15' : '25'}</span>
                </div>
              )}
              {booking.addOns.reflexology && (
                <div className="flex justify-between">
                  <span>Reflexology</span>
                  <span>${isMember ? '15' : '25'}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${price.usd} / {price.aed} AED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4">
                  <LoadingSpinner />
                </div>
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
