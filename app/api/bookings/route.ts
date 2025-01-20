import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { Prisma, BookingStatus, DrinkPackage, MembershipStatus } from '@prisma/client'

type UserWithBookings = {
  id: string
  email: string
  status: MembershipStatus
  bookings: Array<{
    id: string
    status: BookingStatus
  }>
}

// Type for booking creation data
interface CreateBookingData {
  sessionId: string
  packageType?: string
  drinkPackage: DrinkPackage | null
  addOns: {
    iceBath: boolean
    reflexology: boolean
  }
}

export async function POST(request: Request) {
  const authSession = await getServerSession()

  if (!authSession?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json() as CreateBookingData
    const { sessionId, packageType, drinkPackage, addOns } = body

    // Get user with active bookings count
    const user = await prisma.user.findUnique({
      where: { email: authSession.user.email },
      select: {
        id: true,
        email: true,
        status: true,
        bookings: {
          where: {
            status: BookingStatus.CONFIRMED
          }
        }
      }
    }) as UserWithBookings | null

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check active bookings limit for members
    const isMember = user.status === MembershipStatus.MEMBER
    if (isMember && user.bookings.length >= 3) { // Default max bookings is 3
      return NextResponse.json(
        { error: 'Maximum active bookings limit reached' },
        { status: 400 }
      )
    }

    // Get session details
    const sessionData = await prisma.session.findUnique({
      where: { id: sessionId }
    })

    if (!sessionData || sessionData.availableSlots === 0) {
      return NextResponse.json(
        { error: 'Session not found or fully booked' },
        { status: 404 }
      )
    }

    // Validate add-on availability
    if (addOns.iceBath && sessionData.iceSlots === 0) {
      return NextResponse.json(
        { error: 'Ice bath slots no longer available' },
        { status: 400 }
      )
    }
    if (addOns.reflexology && sessionData.reflexSlots === 0) {
      return NextResponse.json(
        { error: 'Reflexology slots no longer available' },
        { status: 400 }
      )
    }

    let basePrice = 0
    let drinkPrice = 0
    let addOnPrice = 0

    // Base price
    if (!isMember) {
      basePrice = packageType === 'BI_WEEKLY' ? 120 : 40
    }

    // Drink package price
    if (drinkPackage === DrinkPackage.PREMIUM) {
      drinkPrice = isMember ? 40 : 45
    } else if (drinkPackage === DrinkPackage.BASIC) {
      drinkPrice = isMember ? 20 : 25
    }

    // Add-ons price
    if (addOns.iceBath) {
      addOnPrice += isMember ? 15 : 25
    }
    if (addOns.reflexology) {
      addOnPrice += isMember ? 15 : 25
    }

    const totalPrice = basePrice + drinkPrice + addOnPrice

    // Start transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Create booking
      const booking = await tx.booking.create({
        data: {
          user: { connect: { id: user.id } },
          session: { connect: { id: sessionId } },
          status: BookingStatus.PENDING_PAYMENT,
          drinkPackage: drinkPackage || DrinkPackage.BASIC,
          hasIceBath: addOns.iceBath,
          hasReflexology: addOns.reflexology,
          basePrice,
          drinkPrice,
          totalPrice
        }
      })

      // Update session
      await tx.session.update({
        where: { id: sessionId },
        data: {
          availableSlots: { decrement: 1 },
          iceSlots: addOns.iceBath ? { decrement: 1 } : undefined,
          reflexSlots: addOns.reflexology ? { decrement: 1 } : undefined
        }
      })

      return booking
    })

    // TODO: Process payment with Stripe
    // For now, just mark as confirmed
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.CONFIRMED }
    })

    return NextResponse.json(booking)

  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// Get user's bookings
export async function GET(request: Request) {
  const authSession = await getServerSession()

  if (!authSession?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        user: {
          email: authSession.user.email
        }
      },
      include: {
        session: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(bookings)

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
