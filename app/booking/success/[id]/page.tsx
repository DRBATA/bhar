import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { DownloadableTicket } from '@/app/components/downloadable-ticket'
import { MemberDrawer } from '@/app/components/member-drawer'
import { DrinkPackage } from '@prisma/client'

// Enums matching our schema
type MembershipType = 'NON_MEMBER' | 'MONTHLY'
type Currency = 'USD' | 'AED'

interface BookingData {
  id: string
  date: Date
  startTime: string
  endTime: string
  drinkPackage: DrinkPackage
  totalPrice: number
  currency: Currency
  user: {
    membershipType: MembershipType
    bookings: Array<{
      id: string
      date: Date
      startTime: string
      endTime: string
      drinkPackage: DrinkPackage
    }>
  }
}

type YachtSession = {
  id: string
  date: Date
  isWeekend: boolean
}

type User = {
  id: string
  membershipType: MembershipType
}

// Type for raw SQL query result
type BookingQueryResult = {
  id: string
  userId: string
  drinkPackage: DrinkPackage
  totalPrice: number
  currency: Currency
  sessionId: string
  date: Date
  isWeekend: boolean
  membershipType: MembershipType
}

// Type for user bookings query result
type UserBookingQueryResult = {
  id: string
  drinkPackage: DrinkPackage
  date: Date
  isWeekend: boolean
}

export default async function BookingSuccessPage({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession()
  
  // Redirect if not logged in
  if (!session?.user?.email) {
    redirect('/login')
  }

  // Get booking details
  const booking = await prisma.$queryRaw<BookingQueryResult[]>`
    SELECT 
      b.id, b."userId", b."drinkPackage", b."totalPrice", b.currency,
      s.id as "sessionId", s.date, s."isWeekend",
      u.id as "userId", u."membershipType"
    FROM "Booking" b
    JOIN "YachtSession" s ON b."sessionId" = s.id
    JOIN "User" u ON b."userId" = u.id
    WHERE b.id = ${params.id}
  `

  if (!booking[0]) {
    redirect('/booking')
  }

  // Get user's other bookings
  const userBookings = await prisma.$queryRaw<UserBookingQueryResult[]>`
    SELECT 
      b.id, b."drinkPackage",
      s.date, s."isWeekend"
    FROM "Booking" b
    JOIN "YachtSession" s ON b."sessionId" = s.id
    WHERE b."userId" = ${booking[0].userId}
    ORDER BY s.date ASC
  `

  if (!booking) {
    redirect('/booking')
  }

  const currentBooking = booking[0]
  const bookingData: BookingData = {
    id: currentBooking.id,
    date: currentBooking.date,
    startTime: currentBooking.isWeekend ? '9:00 AM' : '6:00 AM',
    endTime: currentBooking.isWeekend ? '12:00 PM' : '9:00 AM',
    drinkPackage: currentBooking.drinkPackage,
    totalPrice: currentBooking.totalPrice,
    currency: currentBooking.currency,
    user: {
      membershipType: currentBooking.membershipType,
      bookings: userBookings.map(b => ({
        id: b.id,
        date: b.date,
        startTime: b.isWeekend ? '9:00 AM' : '6:00 AM',
        endTime: b.isWeekend ? '12:00 PM' : '9:00 AM',
        drinkPackage: b.drinkPackage
      }))
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
        <p className="text-gray-600 mt-2">Your yacht experience has been booked successfully.</p>
      </div>

      {/* Show downloadable ticket for non-members */}
      {bookingData.user.membershipType === 'NON_MEMBER' && (
        <DownloadableTicket booking={bookingData} />
      )}

      {/* Show member drawer for subscribers */}
      {bookingData.user.membershipType === 'MONTHLY' && (
        <MemberDrawer
          isOpen={true}
          onClose={() => {/* Handled by parent */}}
          bookings={bookingData.user.bookings}
        />
      )}

      <div className="mt-8 text-center">
        <a 
          href="/booking"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Book Another Session
        </a>
      </div>
    </div>
  )
}
