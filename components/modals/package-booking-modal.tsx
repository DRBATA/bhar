'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/use-toast'

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

interface PackageBookingModalProps {
  isOpen: boolean
  onClose: () => void
  package: Package
}

export function PackageBookingModal({ isOpen, onClose, package: pkg }: PackageBookingModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleBooking = async () => {
    try {
      setLoading(true)
      
      // First check if user is logged in
      const response = await fetch('/api/user')
      const data = await response.json()

      if (!response.ok) {
        toast({
          title: 'Please log in',
          description: 'You need to be logged in to book a package',
          variant: 'destructive'
        })
        return
      }

      // Create booking
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          packageId: pkg.id,
          date: new Date().toISOString()
        })
      })

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking')
      }

      toast({
        title: 'Success!',
        description: 'Your booking has been confirmed. Check your email for details.',
      })

      onClose()
    } catch (error) {
      console.error('Error booking package:', error)
      toast({
        title: 'Error',
        description: 'Failed to book package. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Confirm Booking"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-6">
        <p className="text-sm text-white/60">
          Review your package details before confirming
        </p>

        {/* Package Details */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{pkg.name}</h3>
          <p className="text-white/60 mb-4">{pkg.description}</p>
          <p className="text-2xl font-bold text-miami-coral">{pkg.memberPrice} AED</p>
        </div>

        {/* Drinks List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/80">Included Drinks:</h4>
          {pkg.drinks.map((drink) => (
            <div key={drink.drink.id} className="flex justify-between text-sm">
              <span className="text-white">{drink.drink.name}</span>
              <span className="text-white/60">
                {drink.quantity === -1 ? 'Unlimited' : `${drink.quantity}x`}
              </span>
            </div>
          ))}
        </div>

        {/* Terms */}
        <div className="text-sm text-white/60 space-y-2">
          <p>• Valid for tomorrow only</p>
          <p>• Drinks must be consumed during your visit</p>
          <p>• Non-transferable and non-refundable</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBooking}
            disabled={loading}
            className="bg-miami-coral hover:bg-miami-coral/90"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
