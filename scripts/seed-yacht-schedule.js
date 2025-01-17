const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Schedule configuration
const WEEKS = 2 // Start with 2 weeks for testing
const YACHT_EVENTS = [
  {
    type: 'MORNING_PARTY',
    name: 'Morning Wellness on the Water (Weekday)',
    description: 'Start your day with energy and good vibes on our luxury yacht. Experience sunrise yoga, meditation, ice baths, and more.',
    duration: 180, // 3 hours
    capacity: 100,
    memberPrice: 150,
    nonMemberPrice: 200,
    startTime: '06:00',
    endTime: '09:00',
    daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
  },
  {
    type: 'MORNING_PARTY',
    name: 'Morning Wellness on the Water (Weekend)',
    description: 'Start your weekend with energy and good vibes on our luxury yacht. Experience sunrise yoga, meditation, ice baths, and more.',
    duration: 180, // 3 hours
    capacity: 100,
    memberPrice: 150,
    nonMemberPrice: 200,
    startTime: '09:00',
    endTime: '12:00',
    daysOfWeek: [0, 6] // Sunday (0) and Saturday (6)
  },
  {
    type: 'MORNING_PARTY',
    name: 'Women-Only Wellness Experience',
    description: 'An exclusive women-only morning wellness experience. Connect, energize, and transform with like-minded women on our luxury yacht.',
    duration: 180,
    capacity: 100,
    memberPrice: 150,
    nonMemberPrice: null, // Members only
    startTime: '09:00', // Weekend timing since Feb 2nd is Sunday
    endTime: '12:00',
    specialDate: new Date('2024-02-02') // Special event date
  }
]

async function main() {
  try {
    // Clear existing data
    console.log('Clearing existing yacht schedules...')
    await prisma.eventSchedule.deleteMany({
      where: {
        event: {
          type: 'MORNING_PARTY'
        }
      }
    })
    await prisma.event.deleteMany({
      where: {
        type: 'MORNING_PARTY'
      }
    })

    // Create yacht events
    console.log('Creating yacht events...')
    const yachtEvents = await Promise.all(
      YACHT_EVENTS.map(event =>
        prisma.event.create({
          data: {
            type: event.type,
            name: event.name,
            description: event.description,
            duration: event.duration,
            capacity: event.capacity,
            memberPrice: event.memberPrice,
            nonMemberPrice: event.nonMemberPrice || 0 // 0 for members-only events
          }
        })
      )
    )

    const schedules = []

    // First, add regular schedules for next 2 weeks
    console.log('Generating regular schedules...')
    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)

    for (let week = 0; week < WEEKS; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + (week * 7) + day)
        const dayOfWeek = date.getDay()

        // Add regular weekday and weekend events
        yachtEvents.slice(0, 2).forEach((yachtEvent, index) => {
          const eventConfig = YACHT_EVENTS[index]
          if (eventConfig.daysOfWeek?.includes(dayOfWeek)) {
            const startTime = new Date(date)
            const [startHour, startMinute] = eventConfig.startTime.split(':')
            startTime.setHours(parseInt(startHour), parseInt(startMinute))

            const endTime = new Date(date)
            const [endHour, endMinute] = eventConfig.endTime.split(':')
            endTime.setHours(parseInt(endHour), parseInt(endMinute))

            schedules.push({
              eventId: yachtEvent.id,
              date,
              startTime,
              endTime,
              capacity: eventConfig.capacity
            })
          }
        })
      }
    }

    // Add special women-only event
    console.log('Adding special women-only event...')
    const specialEvent = yachtEvents[2]
    const specialConfig = YACHT_EVENTS[2]
    const specialDate = specialConfig.specialDate

    const specialStartTime = new Date(specialDate)
    const [startHour, startMinute] = specialConfig.startTime.split(':')
    specialStartTime.setHours(parseInt(startHour), parseInt(startMinute))

    const specialEndTime = new Date(specialDate)
    const [endHour, endMinute] = specialConfig.endTime.split(':')
    specialEndTime.setHours(parseInt(endHour), parseInt(endMinute))

    schedules.push({
      eventId: specialEvent.id,
      date: specialDate,
      startTime: specialStartTime,
      endTime: specialEndTime,
      capacity: specialConfig.capacity
    })

    // Create all schedules
    console.log('Creating schedule entries...')
    await prisma.eventSchedule.createMany({
      data: schedules
    })

    // Print summary
    console.log('\nSchedule Summary:')
    for (let i = 0; i < yachtEvents.length; i++) {
      const event = yachtEvents[i]
      const config = YACHT_EVENTS[i]
      const count = await prisma.eventSchedule.count({
        where: { eventId: event.id }
      })

      console.log(`\n${event.name}:`)
      console.log(`- Sessions created: ${count}`)
      console.log(`- Time: ${config.startTime} - ${config.endTime}`)
      console.log(`- Capacity: ${config.capacity} people`)
      console.log(`- Member price: ${config.memberPrice} AED`)
      if (config.nonMemberPrice) {
        console.log(`- Non-member price: ${config.nonMemberPrice} AED`)
      } else {
        console.log('- Members only event')
      }
      
      if (config.specialDate) {
        console.log(`- Special event date: ${config.specialDate.toDateString()}`)
      } else {
        console.log(`- Days: ${config.daysOfWeek.map(d => 
          ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d]
        ).join(', ')}`)
      }
    }

  } catch (error) {
    console.error('Error seeding yacht schedule:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)
