import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'
import { Prisma, BookingStatus, MembershipStatus } from '@prisma/client'

// Define the booking query structure
const bookingInclude = {
  user: {
    select: {
      id: true,
      email: true,
      status: true
    }
  },
  session: {
    select: {
      id: true,
      startTime: true,
      status: true,
      availableSlots: true
    }
  }
} satisfies Prisma.BookingInclude

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: typeof bookingInclude
}>

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authSession = await getServerSession()

  if (!authSession?.user?.email) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Unauthorized'
      },
      { status: 401 }
    )
  }

  try {
    // Get booking with user details
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: bookingInclude
    })

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking not found'
        },
        { status: 404 }
      )
    }

    // Check if user owns this booking
    if (booking.userId !== authSession.user.email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authorized to cancel this booking'
        },
        { status: 403 }
      )
    }

    // Check if user is a member
    if (booking.user.status !== MembershipStatus.MEMBER) {
      return NextResponse.json(
        {
          success: false,
          error: 'Only members can cancel bookings'
        },
        { status: 400 }
      )
    }

    // Check if session hasn't started yet
    const now = new Date()
    if (booking.session.startTime < now) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot cancel past sessions'
        },
        { status: 400 }
      )
    }

    // Update booking status
    await prisma.booking.update({
      where: { id: params.id },
      data: { 
        status: BookingStatus.CANCELLED,
        notes: `Cancelled by user on ${new Date().toISOString()}`
      }
    })

    // Return slots to session
    await prisma.session.update({
      where: { id: booking.session.id },
      data: {
        availableSlots: { increment: 1 }
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Cancel booking error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cancel booking'
      },
      { status: 500 }
    )
  }
}
