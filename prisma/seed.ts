import { PrismaClient, EventType, PackageType, MembershipStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean up existing data
  await prisma.bookingPackage.deleteMany()
  await prisma.bookingEvent.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.packageDrink.deleteMany()
  await prisma.eventSchedule.deleteMany()
  await prisma.event.deleteMany()
  await prisma.drink.deleteMany()
  await prisma.package.deleteMany()
  await prisma.user.deleteMany()

  // Create Events
  const morningParty = await prisma.event.create({
    data: {
      type: EventType.MORNING_PARTY,
      name: 'Sunrise Morning Party',
      description: 'Start your day with energy and good vibes',
      duration: 180, // 3 hours
      capacity: 100,
      memberPrice: 150,    // Members get 25% off
      nonMemberPrice: 200  // Regular price
    }
  })

  const waterBar = await prisma.event.create({
    data: {
      type: EventType.WATER_BAR,
      name: 'Premium Water Bar',
      description: 'All-inclusive hydration service with premium waters and adaptogens',
      duration: 180,
      capacity: 100,
      memberPrice: 0,      // Free for members
      nonMemberPrice: 50   // Pay for non-members
    }
  })

  const yoga = await prisma.event.create({
    data: {
      type: EventType.YOGA,
      name: 'Sunrise Yoga',
      description: 'Start your morning with mindful movements',
      duration: 60,
      capacity: 20,
      memberPrice: 75,     // 25% member discount
      nonMemberPrice: 100
    }
  })

  const iceBath = await prisma.event.create({
    data: {
      type: EventType.ICE_BATH,
      name: 'Ice Bath Experience',
      description: 'Rejuvenate with cold therapy',
      duration: 30,
      capacity: 10,
      memberPrice: 60,     // 25% member discount
      nonMemberPrice: 80
    }
  })

  // Create Drinks (included in Water Bar service)
  const drinks = await Promise.all([
    prisma.drink.create({
      data: {
        name: 'Morning Elixir',
        description: 'Energizing blend of premium waters and minerals'
      }
    }),
    prisma.drink.create({
      data: {
        name: 'Recovery Tonic',
        description: 'Post-activity hydration blend'
      }
    }),
    prisma.drink.create({
      data: {
        name: 'Wellness Fusion',
        description: 'Adaptogenic water blend'
      }
    })
  ])

  // Create Packages
  const yachtOnly = await prisma.package.create({
    data: {
      type: PackageType.YACHT_ONLY,
      name: 'Basic Yacht Experience',
      description: 'Access to our luxury yacht',
      memberPrice: 750,     // 25% member discount
      nonMemberPrice: 1000
    }
  })

  const yachtDrinks = await prisma.package.create({
    data: {
      type: PackageType.YACHT_DRINKS,
      name: 'Yacht + Premium Drinks',
      description: 'Yacht access with Water Bar service',
      memberPrice: 900,     // Better bundle savings for members
      nonMemberPrice: 1300, // Bundle savings vs individual
      drinks: {
        create: drinks.map(drink => ({
          drinkId: drink.id,
          quantity: 3 // 3 of each drink included
        }))
      }
    }
  })

  const yachtFull = await prisma.package.create({
    data: {
      type: PackageType.YACHT_FULL,
      name: 'Ultimate Yacht Experience',
      description: 'All-inclusive yacht package with drinks and activities',
      memberPrice: 1200,    // Best value for members
      nonMemberPrice: 1800, // Best bundle value
      drinks: {
        create: drinks.map(drink => ({
          drinkId: drink.id,
          quantity: 5 // 5 of each drink included
        }))
      }
    }
  })

  // Create Event Schedules (for next 7 days)
  const today = new Date()
  const schedules = []
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    date.setHours(6, 0, 0, 0) // 6 AM start

    // Morning Party Schedule
    schedules.push(
      prisma.eventSchedule.create({
        data: {
          eventId: morningParty.id,
          date,
          startTime: new Date(date.setHours(6, 0)), // 6 AM
          endTime: new Date(date.setHours(9, 0)),   // 9 AM
          capacity: 100
        }
      })
    )

    // Water Bar Schedule (same times as morning party)
    schedules.push(
      prisma.eventSchedule.create({
        data: {
          eventId: waterBar.id,
          date,
          startTime: new Date(date.setHours(6, 0)), // 6 AM
          endTime: new Date(date.setHours(9, 0)),   // 9 AM
          capacity: 100
        }
      })
    )

    // Yoga Schedule
    schedules.push(
      prisma.eventSchedule.create({
        data: {
          eventId: yoga.id,
          date,
          startTime: new Date(date.setHours(6, 30)), // 6:30 AM
          endTime: new Date(date.setHours(7, 30)),   // 7:30 AM
          capacity: 20
        }
      })
    )

    // Ice Bath Schedule
    schedules.push(
      prisma.eventSchedule.create({
        data: {
          eventId: iceBath.id,
          date,
          startTime: new Date(date.setHours(7, 45)), // 7:45 AM
          endTime: new Date(date.setHours(8, 15)),   // 8:15 AM
          capacity: 10
        }
      })
    )
  }

  await Promise.all(schedules)

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
