import { PrismaClient, EventType, UserRole, MembershipStatus, EventCategory, BookingStatus, DrinkPackage } from '@prisma/client'
import { addDays, addMinutes, setHours, setMinutes, setSeconds, isSaturday, isSunday } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  // Create the yacht session event template
  const yachtSession = await prisma.event.create({
    data: {
      type: EventType.YACHT_SESSION,
      category: EventCategory.WELLNESS,
      name: 'Morning Yacht Session',
      description: 'Three-hour morning session on our luxury yacht with water bar service.',
      duration: 180, // 3 hours
      capacity: 100,
      memberPrice: 0,    // Free for subscribers
      nonMemberPrice: 30, // Day pass price ($30)
    },
  })

  // Create wellness activities (included with any booking)
  const soberRave = await prisma.event.create({
    data: {
      type: EventType.SOBER_RAVE,
      category: EventCategory.WELLNESS,
      name: 'Morning Rave',
      description: 'High-energy morning dance party with live DJ. Pure natural euphoria!',
      duration: 180, // Runs during yacht session
      capacity: 100,
      memberPrice: 0,    // Free with any booking
      nonMemberPrice: 0,
    },
  })

  const yoga = await prisma.event.create({
    data: {
      type: EventType.YOGA,
      category: EventCategory.WELLNESS,
      name: 'Morning Yoga',
      description: 'Energizing yoga session to start your day',
      duration: 180, // Runs during yacht session
      capacity: 100,
      memberPrice: 0,    // Free with any booking
      nonMemberPrice: 0,
    },
  })

  const functionalFitness = await prisma.event.create({
    data: {
      type: EventType.FUNCTIONAL_FITNESS,
      category: EventCategory.WELLNESS,
      name: 'Functional Fitness',
      description: 'Dynamic workout session focusing on movement and strength',
      duration: 180, // Runs during yacht session
      capacity: 100,
      memberPrice: 0,    // Free with any booking
      nonMemberPrice: 0,
    },
  })

  // Create add-on activities
  const iceBath = await prisma.event.create({
    data: {
      type: EventType.ICE_BATH,
      category: EventCategory.ADD_ON,
      name: 'Ice Bath Experience',
      description: 'Guided ice bath session with breathing techniques',
      duration: 20,
      capacity: 2,
      memberPrice: 40,   // Member price
      nonMemberPrice: 60, // Regular price
    },
  })

  const reflexology = await prisma.event.create({
    data: {
      type: EventType.REFLEXOLOGY,
      category: EventCategory.ADD_ON,
      name: 'Reflexology Session',
      description: 'Relaxing reflexology treatment',
      duration: 20,
      capacity: 1,
      memberPrice: 40,   // Member price
      nonMemberPrice: 60, // Regular price
    },
  })

  // Create a week of yacht sessions with add-on slots
  const startDate = new Date()
  setSeconds(setMinutes(setHours(startDate, 0), 0), 0) // Normalize to start of day

  for (let i = 0; i < 7; i++) {
    const date = addDays(startDate, i)
    const isWeekend = isSaturday(date) || isSunday(date)
    
    // Set session times based on day type
    const sessionStart = isWeekend ? 
      setMinutes(setHours(date, 9), 0) : // 9am weekends
      setMinutes(setHours(date, 6), 0)   // 6am weekdays
    
    const sessionEnd = addMinutes(sessionStart, 180) // 3 hours later

    // Create yacht session
    const schedule = await prisma.eventSchedule.create({
      data: {
        eventId: yachtSession.id,
        date,
        startTime: sessionStart,
        endTime: sessionEnd,
        capacity: 100,
        // Randomly assign a wellness activity
        wellnessEventId: [soberRave.id, yoga.id, functionalFitness.id][Math.floor(Math.random() * 3)],
      },
    })

    // Create 20-minute slots throughout the session
    let slotStart = sessionStart
    while (slotStart < sessionEnd) {
      // Create ice bath slot
      await prisma.bookingEvent.create({
        data: {
          eventId: iceBath.id,
          scheduleId: schedule.id,
          startTime: slotStart,
          endTime: addMinutes(slotStart, 20),
          capacity: 2,
          finalPrice: 60, // Regular price
        },
      })

      // Create reflexology slot
      await prisma.bookingEvent.create({
        data: {
          eventId: reflexology.id,
          scheduleId: schedule.id,
          startTime: slotStart,
          endTime: addMinutes(slotStart, 20),
          capacity: 1,
          finalPrice: 60, // Regular price
        },
      })

      slotStart = addMinutes(slotStart, 20)
    }
  }

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed_password_here',
      role: UserRole.ADMIN,
      membershipStatus: MembershipStatus.NON_MEMBER,
      emailVerified: true,
    },
  })

  // Create member user
  const member = await prisma.user.create({
    data: {
      name: 'Member User',
      email: 'member@example.com',
      password: 'hashed_password_here',
      role: UserRole.USER,
      membershipStatus: MembershipStatus.MEMBER,
      membershipStart: startDate,
      membershipEnd: addDays(startDate, 365), // 1 year
      emailVerified: true,
    },
  })

  // Create non-member user
  const nonMember = await prisma.user.create({
    data: {
      name: 'Non-Member User',
      email: 'nonmember@example.com',
      password: 'hashed_password_here',
      role: UserRole.USER,
      membershipStatus: MembershipStatus.NON_MEMBER,
      emailVerified: true,
    },
  })

  // Create member booking with add-ons and premium drinks
  const memberSchedule = await prisma.eventSchedule.findFirst({
    where: {
      eventId: yachtSession.id,
      startTime: {
        gt: addDays(startDate, 3), // Book a few days out
      },
    },
  })

  if (memberSchedule) {
    // Create member booking
    const booking = await prisma.booking.create({
      data: {
        userId: member.id,
        membershipAtBooking: MembershipStatus.MEMBER,
        status: BookingStatus.CONFIRMED,
        drinkPackage: DrinkPackage.PREMIUM,
        drinkNotes: '2 adaptogens, 2 non-alcoholic',
        finalPrice: 230, // Premium drinks (150) + Ice Bath (40) + Reflexology (40)
        addOns: {
          iceBath: true,
          reflexology: true,
        },
        notes: 'Member booking with premium drinks and wellness add-ons',
      },
    })

    // Add yacht session to booking
    await prisma.bookingEvent.create({
      data: {
        bookingId: booking.id,
        eventId: yachtSession.id,
        scheduleId: memberSchedule.id,
        startTime: memberSchedule.startTime,
        endTime: memberSchedule.endTime,
        finalPrice: 0, // Free for members
      },
    })
  }

  // Create non-member booking with basic drinks
  const nonMemberSchedule = await prisma.eventSchedule.findFirst({
    where: {
      eventId: yachtSession.id,
      startTime: {
        gt: addDays(startDate, 1), // Book tomorrow
      },
    },
  })

  if (nonMemberSchedule) {
    // Create non-member booking
    const booking = await prisma.booking.create({
      data: {
        userId: nonMember.id,
        membershipAtBooking: MembershipStatus.NON_MEMBER,
        status: BookingStatus.CONFIRMED,
        drinkPackage: DrinkPackage.BASIC,
        drinkNotes: '2 adaptogens',
        finalPrice: 120, // Day pass (30) + Basic drinks (90)
        notes: 'Non-member booking with basic drinks package',
      },
    })

    // Add yacht session to booking
    await prisma.bookingEvent.create({
      data: {
        bookingId: booking.id,
        eventId: yachtSession.id,
        scheduleId: nonMemberSchedule.id,
        startTime: nonMemberSchedule.startTime,
        endTime: nonMemberSchedule.endTime,
        finalPrice: 30, // Day pass price
      },
    })
  }

  console.log({
    message: 'Seed data created successfully',
    summary: {
      access: {
        dayPass: {
          price: 30,
          bookings: 1,
        },
        weekPass: {
          price: 60,
          bookings: 3,
        },
        twoWeekPass: {
          price: 100,
          bookings: 6,
        },
        subscription: {
          price: 150,
          benefits: [
            'Up to 3 active bookings',
            'Member prices on add-ons',
            'Access to all wellness activities'
          ]
        }
      },
      addOns: {
        iceBath: {
          slots: '20-minute sessions',
          capacity: '2 people per slot',
          pricing: {
            regular: 60,
            member: 40,
          }
        },
        reflexology: {
          slots: '20-minute sessions',
          capacity: '1 person per slot',
          pricing: {
            regular: 60,
            member: 40,
          }
        }
      },
      drinks: {
        basic: {
          price: 90,
          includes: 'Any 2 drinks (adaptogens or non-alcoholic)',
          examples: [
            '2 adaptogens',
            '2 non-alcoholic',
            '1 adaptogen + 1 non-alcoholic'
          ]
        },
        premium: {
          price: 150,
          includes: 'Any 4 drinks (adaptogens or non-alcoholic)',
          examples: [
            '4 adaptogens',
            '4 non-alcoholic',
            '2 adaptogens + 2 non-alcoholic'
          ]
        }
      }
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
