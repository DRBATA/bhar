import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// GET /api/admin/schedules
export async function GET(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Parse dates
    const start = startDate ? new Date(startDate) : new Date()
    start.setHours(0, 0, 0, 0)
    
    const end = endDate ? new Date(endDate) : new Date()
    end.setHours(23, 59, 59, 999)

    const schedules = await prisma.eventSchedule.findMany({
      where: {
        ...(eventId && { eventId }),
        date: {
          gte: start,
          lte: end
        }
      },
      include: {
        event: {
          select: {
            name: true,
            type: true,
            capacity: true
          }
        },
        bookings: {
          select: {
            id: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ]
    })

    // Add availability info
    const schedulesWithAvailability = schedules.map(schedule => ({
      ...schedule,
      bookedCount: schedule.bookings.length,
      availableSpots: schedule.capacity - schedule.bookings.length
    }))

    return NextResponse.json(schedulesWithAvailability)
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// POST /api/admin/schedules
export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { 
      eventId,
      dates,          // Array of dates for recurring events
      startTime,      // Base start time for all dates
      endTime,        // Base end time for all dates
      capacity,       // Optional override of event capacity
      recurring      // If true, create schedules for all dates
    } = body

    if (!eventId || !dates || !startTime || !endTime) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Create schedules for all dates
    const schedules = await Promise.all(
      dates.map(async (date: string) => {
        const scheduleDate = new Date(date)
        const start = new Date(scheduleDate.toDateString() + ' ' + startTime)
        const end = new Date(scheduleDate.toDateString() + ' ' + endTime)

        return prisma.eventSchedule.create({
          data: {
            eventId,
            date: scheduleDate,
            startTime: start,
            endTime: end,
            capacity: capacity || undefined
          },
          include: {
            event: {
              select: {
                name: true,
                type: true,
                capacity: true
              }
            }
          }
        })
      })
    )

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Error creating schedules:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// PATCH /api/admin/schedules
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const scheduleId = searchParams.get('id')

    if (!scheduleId) {
      return new NextResponse('Schedule ID required', { status: 400 })
    }

    const body = await req.json()
    const { startTime, endTime, capacity } = body

    const schedule = await prisma.eventSchedule.update({
      where: { id: scheduleId },
      data: {
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        capacity
      },
      include: {
        event: {
          select: {
            name: true,
            type: true,
            capacity: true
          }
        },
        bookings: {
          select: {
            id: true
          }
        }
      }
    })

    return NextResponse.json({
      ...schedule,
      bookedCount: schedule.bookings.length,
      availableSpots: schedule.capacity - schedule.bookings.length
    })
  } catch (error) {
    console.error('Error updating schedule:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// DELETE /api/admin/schedules
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const scheduleId = searchParams.get('id')

    if (!scheduleId) {
      return new NextResponse('Schedule ID required', { status: 400 })
    }

    // Check if there are any bookings
    const schedule = await prisma.eventSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        bookings: {
          select: { id: true }
        }
      }
    })

    if (schedule?.bookings.length) {
      return new NextResponse('Cannot delete schedule with existing bookings', { status: 400 })
    }

    await prisma.eventSchedule.delete({
      where: { id: scheduleId }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting schedule:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
