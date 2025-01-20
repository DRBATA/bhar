'use client'

import { DrinkRedeem } from './drink-redeem'
import { DrinkPackage } from '@prisma/client'

type Currency = 'USD' | 'AED'

interface TicketProps {
  booking: {
    id: string
    date: Date
    startTime: string
    endTime: string
    drinkPackage: DrinkPackage | null
    totalPrice: number
    currency: Currency
  }
}

export function DownloadableTicket({ booking }: TicketProps) {
  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  return (
    <div className="booking-ticket max-w-sm mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Yacht Experience</h2>
        <p className="text-gray-600">
          {formattedDate}
        </p>
        <p className="text-gray-600">
          {booking.startTime} - {booking.endTime}
        </p>
      </div>

      <div className="border-t border-b py-4 my-4">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Booking ID</span>
          <span className="font-mono">{booking.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Amount Paid</span>
          <span>{booking.currency === 'USD' ? '$' : 'AED'} {booking.totalPrice}</span>
        </div>
      </div>

      {/* Show drink redemption only if there's a drink package */}
      {booking.drinkPackage && (
        <DrinkRedeem 
          drinkPackage={booking.drinkPackage} 
          date={booking.date}
        />
      )}

      {/* QR Code placeholder for future feature */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Show this ticket to staff upon arrival
      </div>

      {/* Download Button - hidden in print */}
      <button 
        onClick={() => window.print()}
        className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 no-print"
      >
        Save Ticket
      </button>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .booking-ticket, .booking-ticket * {
            visibility: visible;
          }
          .booking-ticket {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
