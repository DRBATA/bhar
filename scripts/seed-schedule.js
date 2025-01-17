const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Schedule configuration
const WEEKS = 12
const EVENTS = [
  {
    type: 'MORNING_PARTY',
    name: 'Sunrise Morning Party',
    description: 'Start your day with energy and good vibes',
    duration: 180, // 3 hours
    capacity: 100,
    memberPrice: 150,
    nonMemberPrice: 200,
    startTime: '06:00',
    endTime: '09:00',
    daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
  },
  {
    type: 'WATER_BAR',
    name: 'Premium Water Bar',
    description: 'All-inclusive hydration service with premium waters and adaptogens',
    duration: 180,
    capacity: 100,
    memberPrice: 0,
    nonMemberPrice: 50,
    startTime: '06:00',
    endTime: '09:00',
    daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
  },
  {
    type: 'YOGA',
    name: 'Sunrise Yoga',
    description: 'Start your morning with mindful movements',
    duration: 60,
    capacity: 20,
    memberPrice: 75,
    nonMemberPrice: 100,
    startTime: '06:30',
    endTime: '07:30',
    daysOfWeek: [1, 3, 5] // Monday, Wednesday, Friday
  },
  {
    type: 'ICE_BATH',
    name: 'Ice Bath Experience',
    description: 'Rejuvenate with cold therapy',
    duration: 30,
    capacity: 10,
    memberPrice: 60,
    nonMemberPrice: 80,
    startTime: '07:45',
    endTime: '08:15',
    daysOfWeek: [2, 4] // Tuesday, Thursday
  }
]

async function main() {
  try {
    // Clear existing data
    console.log('Clearing existing data...')
    await prisma.eventSchedule.deleteMany()
    await prisma.event.deleteMany()

    // Create events
    console.log('Creating events...')
    const events = await Promise.all(
      EVENTS.map(event => 
        prisma.event.create({
          data: {
            type: event.type,
            name: event.name,
            description: event.description,
            duration: event.duration,
            capacity: event.capacity,
            memberPrice: event.memberPrice,
            nonMemberPrice: event.nonMemberPrice
          }
        })
      )
    )

    // Generate dates for next 12 weeks
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    const schedules = []

    console.log('Generating schedules...')
    for (let week = 0; week < WEEKS; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + (week * 7) + day)

        // For each event, check if it runs on this day
        events.forEach((event, index) => {
          const eventConfig = EVENTS[index]
          if (eventConfig.daysOfWeek.includes(date.getDay())) {
            // Create schedule
            const startTime = new Date(date)
            const [startHour, startMinute] = eventConfig.startTime.split(':')
            startTime.setHours(parseInt(startHour), parseInt(startMinute))

            const endTime = new Date(date)
            const [endHour, endMinute] = eventConfig.endTime.split(':')
            endTime.setHours(parseInt(endHour), parseInt(endMinute))

            schedules.push({
              eventId: event.id,
              date,
              startTime,
              endTime,
              capacity: eventConfig.capacity
            })
          }
        })
      }
    }

    // Create all schedules
    console.log('Creating schedule entries...')
    await prisma.eventSchedule.createMany({
      data: schedules
    })

    const totalSchedules = await prisma.eventSchedule.count()
    console.log(`Created ${events.length} events with ${totalSchedules} schedule entries`)

    // Print summary
    console.log('\nSchedule Summary:')
    for (const event of events) {
      const count = await prisma.eventSchedule.count({
        where: { eventId: event.id }
      })
      console.log(`${event.name}: ${count} sessions`)
    }

  } catch (error) {
    console.error('Error seeding schedule:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)
