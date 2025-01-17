import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// GET /api/admin/members
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const members = await prisma.user.findMany({
      where: {
        membershipStatus: {
          not: 'NON_MEMBER'
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        membershipStatus: true,
        membershipStart: true,
        membershipEnd: true,
        bookings: {
          select: {
            id: true,
            date: true,
            status: true,
            events: {
              select: {
                event: {
                  select: {
                    name: true,
                    type: true
                  }
                }
              }
            }
          },
          orderBy: {
            date: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: {
        membershipStart: 'desc'
      }
    })

    // Calculate statistics
    const stats = {
      total: members.length,
      premium: members.filter(m => m.membershipStatus === 'PREMIUM').length,
      standard: members.filter(m => m.membershipStatus === 'MEMBER').length,
      activeThisMonth: members.filter(m => {
        const lastBooking = m.bookings[0]
        if (!lastBooking) return false
        const lastMonth = new Date()
        lastMonth.setMonth(lastMonth.getMonth() - 1)
        return new Date(lastBooking.date) > lastMonth
      }).length
    }

    return NextResponse.json({ members, stats })
  } catch (error) {
    console.error('Error fetching members:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// PATCH /api/admin/members
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return new NextResponse('User ID required', { status: 400 })
    }

    const body = await req.json()
    const { membershipStatus, membershipEnd } = body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        membershipStatus,
        membershipEnd: membershipEnd ? new Date(membershipEnd) : undefined
      },
      select: {
        id: true,
        name: true,
        email: true,
        membershipStatus: true,
        membershipStart: true,
        membershipEnd: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating member:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// POST /api/admin/members/stats
export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { startDate, endDate } = body

    // Parse dates
    const start = startDate ? new Date(startDate) : new Date()
    start.setHours(0, 0, 0, 0)
    
    const end = endDate ? new Date(endDate) : new Date()
    end.setHours(23, 59, 59, 999)

    // Get member stats for date range
    const stats = await prisma.$transaction([
      // New members in period
      prisma.user.count({
        where: {
          membershipStart: {
            gte: start,
            lte: end
          },
          membershipStatus: {
            not: 'NON_MEMBER'
          }
        }
      }),

      // Active members (made at least one booking)
      prisma.user.count({
        where: {
          membershipStatus: {
            not: 'NON_MEMBER'
          },
          bookings: {
            some: {
              date: {
                gte: start,
                lte: end
              }
            }
          }
        }
      }),

      // Total bookings by members
      prisma.booking.count({
        where: {
          date: {
            gte: start,
            lte: end
          },
          user: {
            membershipStatus: {
              not: 'NON_MEMBER'
            }
          }
        }
      })
    ])

    return NextResponse.json({
      newMembers: stats[0],
      activeMembers: stats[1],
      totalBookings: stats[2],
      period: {
        start,
        end
      }
    })
  } catch (error) {
    console.error('Error fetching member stats:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
