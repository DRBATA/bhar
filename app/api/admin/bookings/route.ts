import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { UserRole } from '@prisma/client'

export async function GET() {
  try {
    // Get user from session
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is staff
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      )
    }

    // Get all bookings with user and event info
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        events: {
          include: {
            event: true,
            schedule: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Admin bookings error:', error)
    return NextResponse.json(
      { message: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// Update booking status
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')
    const body = await request.json()
    const { status } = body

    // Get user from session
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is staff
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { message: 'Access denied' },
        { status: 403 }
      )
    }

    if (!bookingId || !status) {
      return NextResponse.json(
        { message: 'Booking ID and status are required' },
        { status: 400 }
      )
    }

    // Update booking status
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        events: {
          include: {
            event: true,
            schedule: true
          }
        }
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json(
      { message: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
