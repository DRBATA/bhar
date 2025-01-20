import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { BookingStatus } from '@prisma/client'

export async function GET() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const count = await prisma.booking.count({
      where: {
        user: {
          email: session.user.email
        },
        status: BookingStatus.CONFIRMED
      }
    })

    return NextResponse.json({ count })

  } catch (error) {
    console.error('Error getting booking count:', error)
    return NextResponse.json(
      { error: 'Failed to get booking count' },
      { status: 500 }
    )
  }
}
