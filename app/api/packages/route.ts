import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { MembershipStatus } from '@prisma/client'

export async function GET() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        status: true,
        membershipStart: true,
        membershipEnd: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const packages = [
      {
        id: 'one-off',
        name: 'One-off Session',
        description: 'Single session access',
        price: {
          usd: user.status === MembershipStatus.MEMBER ? 0 : 40,
          aed: user.status === MembershipStatus.MEMBER ? 0 : 150
        },
        memberPrice: 'Free',
        features: [
          'One session',
          'Basic drink package included',
          'Access to all facilities',
          'Booking up to 1 week in advance'
        ]
      },
      {
        id: 'bi-weekly',
        name: 'Bi-weekly Package',
        description: 'Two sessions per month',
        price: {
          usd: user.status === MembershipStatus.MEMBER ? 60 : 120,
          aed: user.status === MembershipStatus.MEMBER ? 220 : 440
        },
        memberPrice: '220 AED',
        features: [
          'Two sessions per month',
          'Premium drink package included',
          'Priority booking',
          'Exclusive member events',
          'Booking up to 2 weeks in advance'
        ]
      }
    ]

    return NextResponse.json({
      packages,
      user: {
        isMember: user.status === MembershipStatus.MEMBER,
        membershipStart: user.membershipStart,
        membershipEnd: user.membershipEnd
      }
    })

  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}
