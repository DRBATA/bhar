import { PrismaClient } from '@prisma/client'
import { addDays, setHours, setMinutes } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  // Create base event
  const yachtSession = await prisma.event.create({
    data: {
      type: 'YACHT_SESSION',
      name: 'Sunrise Yacht Session',
      description: 'Start your day with sunrise yoga, meditation, and wellness activities on our luxury yacht.',
      duration: 180, // 3 hours
      capacity: 100,
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

    const startTime = isWeekend ? setHours(date, 9) : setHours(date, 6)
    const endTime = isWeekend ? setHours(date, 12) : setHours(date, 9)

    schedules.push({
      eventId: yachtSession.id,
      date,
      startTime: setMinutes(startTime, 0),
      endTime: setMinutes(endTime, 0),
      capacity: yachtSession.capacity
    })
  }

  // Bulk create schedules
  await prisma.eventSchedule.createMany({
    data: schedules
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
