import { PrismaClient } from '@prisma/client'
import { addDays, setHours, setMinutes } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  // Create base events
  const weekdayEvent = await prisma.event.create({
    data: {
      type: 'YACHT_SESSION',
      name: 'Morning Wellness on the Water (Weekday)',
      description: 'Start your day with sunrise yoga, meditation, and wellness activities on our luxury yacht.',
      duration: 180, // 3 hours
      capacity: 100,
      memberPrice: 150,
      nonMemberPrice: 200,
      category: 'WELLNESS'
    }
  })

  const weekendEvent = await prisma.event.create({
    data: {
      type: 'YACHT_SESSION',
      name: 'Morning Wellness on the Water (Weekend)',
      description: 'Weekend wellness experience with yoga, meditation, and activities on our luxury yacht.',
      duration: 180,
      capacity: 100,
      memberPrice: 180,
      nonMemberPrice: 240,
      category: 'WELLNESS'
    }
  })

  const womenOnlyEvent = await prisma.event.create({
    data: {
      type: 'YACHT_SESSION',
      name: 'Women-Only Wellness Experience',
      description: 'An exclusive wellness experience for women featuring yoga, meditation, and empowerment activities.',
      duration: 180,
      capacity: 80,
      memberPrice: 150,
      nonMemberPrice: 200,
      category: 'WELLNESS'
    }
  })

  // Create schedules for next 30 days
  const startDate = new Date()
  const schedules = []

  for (let i = 0; i < 30; i++) {
    const date = addDays(startDate, i)
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // Skip Mondays (day 1)
    if (dayOfWeek === 1) continue

    const event = isWeekend ? weekendEvent : weekdayEvent
    const startTime = isWeekend ? setHours(date, 9) : setHours(date, 6)
    const endTime = isWeekend ? setHours(date, 12) : setHours(date, 9)

    schedules.push({
      eventId: event.id,
      date,
      startTime: setMinutes(startTime, 0),
      endTime: setMinutes(endTime, 0),
      capacity: event.capacity
    })

    // Add women-only session on Wednesdays
    if (dayOfWeek === 3) {
      schedules.push({
        eventId: womenOnlyEvent.id,
        date,
        startTime: setHours(setMinutes(date, 0), 10),
        endTime: setHours(setMinutes(date, 0), 13),
        capacity: womenOnlyEvent.capacity
      })
    }
  }

  // Bulk create schedules
  await prisma.eventSchedule.createMany({
    data: schedules
  })

  // Create some bookings
  await prisma.booking.create({
    data: {
      userId: '1', // Replace with actual user ID
      membershipAtBooking: 'NON_MEMBER',
      status: 'CONFIRMED',
      finalPrice: 200,
      paidAmount: 200,
      events: {
        create: {
          eventId: weekdayEvent.id,
          scheduleId: '1', // Replace with actual schedule ID
          startTime: new Date(),
          endTime: new Date(),
          finalPrice: 200
        }
      }
    }
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
