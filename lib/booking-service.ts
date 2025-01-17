import { PrismaClient, MembershipType, BookingStatus } from '@prisma/client'
import { getBookingConfirmationEmail } from './email-templates/booking-confirmation'
import { sendEmail } from './email'
import QRCode from 'qrcode'

const prisma = new PrismaClient()

interface CreateBookingParams {
  userId: string
  date: string
  events: Array<{
    eventId: string
    scheduleId: string
  }>
  drinks: Array<{
    drinkId: string
    quantity: number
  }>
}

export async function createBooking(params: CreateBookingParams) {
  const { userId, date, events, drinks } = params

  // Start transaction
  return await prisma.$transaction(async (tx) => {
    // 1. Get user and check membership status
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        membershipType: true,
        bookingsRemaining: true,
      },
    })

    if (!user) throw new Error('User not found')

    // 2. Validate booking allowance
    if (user.membershipType !== MembershipType.SUBSCRIBER && user.bookingsRemaining <= 0) {
      throw new Error('No bookings remaining')
    }

    // 3. Calculate total amount and validate event availability
    let totalAmount = 0
    const bookingEvents = []
    const bookingDrinks = []

    // Check events
    for (const eventBooking of events) {
      const event = await tx.event.findUnique({
        where: { id: eventBooking.eventId },
        include: {
          schedules: {
            where: { id: eventBooking.scheduleId },
            include: {
              bookings: true,
            },
          },
        },
      })

      if (!event) throw new Error('Event not found')
      const schedule = event.schedules[0]
      if (!schedule) throw new Error('Schedule not found')

      // Check capacity
      if (schedule.bookings.length >= schedule.capacity) {
        throw new Error(`${event.name} is fully booked`)
      }

      // Add to total amount
      const price = user.membershipType === MembershipType.SUBSCRIBER 
        ? event.memberPrice 
        : event.price

      totalAmount += price
      bookingEvents.push({
        eventId: event.id,
        scheduleId: schedule.id,
        price,
      })
    }

    // Check drinks
    for (const drinkOrder of drinks) {
      const drink = await tx.drink.findUnique({
        where: { id: drinkOrder.drinkId },
      })

      if (!drink) throw new Error('Drink not found')

      const price = user.membershipType === MembershipType.SUBSCRIBER 
        ? drink.memberPrice 
        : drink.price

      totalAmount += price * drinkOrder.quantity
      bookingDrinks.push({
        drinkId: drink.id,
        quantity: drinkOrder.quantity,
        price,
      })
    }

    // 4. Create booking
    const booking = await tx.booking.create({
      data: {
        userId: user.id,
        date: new Date(date),
        totalAmount,
        status: BookingStatus.PENDING_PAYMENT,
        events: {
          create: bookingEvents,
        },
        drinks: {
          create: bookingDrinks,
        },
      },
      include: {
        events: {
          include: {
            event: true,
            schedule: true,
          },
        },
        drinks: {
          include: {
            drink: true,
          },
        },
      },
    })

    // 5. Generate QR code
    const qrCode = await QRCode.toDataURL(booking.id)
    await tx.booking.update({
      where: { id: booking.id },
      data: { qrCode },
    })

    // 6. Decrement bookings remaining if not subscriber
    if (user.membershipType !== MembershipType.SUBSCRIBER) {
      await tx.user.update({
        where: { id: user.id },
        data: { bookingsRemaining: user.bookingsRemaining - 1 },
      })
    }

    // 7. Send confirmation email
    const emailData = {
      userName: user.name,
      bookingId: booking.id,
      date,
      membershipType: user.membershipType,
      events: booking.events.map(be => ({
        name: be.event.name,
        time: `${be.schedule.startTime.toLocaleTimeString()} - ${be.schedule.endTime.toLocaleTimeString()}`,
        price: be.price,
      })),
      drinks: booking.drinks.map(bd => ({
        name: bd.drink.name,
        quantity: bd.quantity,
        price: bd.price * bd.quantity,
      })),
      totalAmount,
      qrCode,
    }

    await sendEmail({
      to: user.email,
      subject: 'Your Water Bar Morning Party Booking Confirmation',
      html: getBookingConfirmationEmail(emailData),
    })

    return booking
  })
}

export async function confirmBookingPayment(bookingId: string) {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { 
      status: BookingStatus.CONFIRMED,
      paidAmount: {
        equals: 'totalAmount', // Set paidAmount equal to totalAmount
      },
    },
  })
}

export async function cancelBooking(bookingId: string) {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.CANCELLED },
  })
}

export async function validateBookingQR(qrCode: string) {
  const booking = await prisma.booking.findUnique({
    where: { qrCode },
    include: {
      user: true,
      events: {
        include: {
          event: true,
          schedule: true,
        }
      },
    },
  })

  if (!booking) throw new Error('Booking not found')
  if (booking.status !== BookingStatus.CONFIRMED) throw new Error('Booking not confirmed')
  if (booking.checkedIn) throw new Error('Already checked in')

  // Update check-in status
  await prisma.booking.update({
    where: { id: booking.id },
    data: { checkedIn: true },
  })

  return booking
}
