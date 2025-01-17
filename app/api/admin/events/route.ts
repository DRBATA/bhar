import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

// GET /api/admin/events
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const events = await prisma.event.findMany({
      include: {
        schedules: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// POST /api/admin/events
export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { type, name, description, duration, capacity, memberPrice, nonMemberPrice } = body

    const event = await prisma.event.create({
      data: {
        type,
        name,
        description,
        duration,
        capacity,
        memberPrice,
        nonMemberPrice,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error creating event:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// PATCH /api/admin/events
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('id')

    if (!eventId) {
      return new NextResponse('Event ID required', { status: 400 })
    }

    const body = await req.json()
    const { type, name, description, duration, capacity, memberPrice, nonMemberPrice } = body

    const event = await prisma.event.update({
      where: { id: eventId },
      data: {
        type,
        name,
        description,
        duration,
        capacity,
        memberPrice,
        nonMemberPrice,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error updating event:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

// DELETE /api/admin/events
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('id')

    if (!eventId) {
      return new NextResponse('Event ID required', { status: 400 })
    }

    await prisma.event.delete({
      where: { id: eventId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting event:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
