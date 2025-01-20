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
        id: true,
        name: true,
        email: true,
        status: true,
        membershipStart: true,
        membershipEnd: true,
        preferredCurrency: true,
        activeBookingLimit: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...user,
      isMember: user.status === MembershipStatus.MEMBER
    })

  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { preferredCurrency } = body

    if (!preferredCurrency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { preferredCurrency },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        membershipStart: true,
        membershipEnd: true,
        preferredCurrency: true,
        activeBookingLimit: true
      }
    })

    return NextResponse.json({
      ...user,
      isMember: user.status === MembershipStatus.MEMBER
    })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
