import { PrismaClient, UserRole, MembershipStatus, DrinkPackage, BookingStatus, Currency } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

// Constants for pricing (USD)
const PRICES = {
  DRINKS: {
    BASIC: 25,    // 90 AED - 1+1 drinks
    PREMIUM: 45   // 165 AED - 2+2 drinks
  },
  EXPERIENCES: {
    ICE_BATH: {
      MEMBER: 15,     // 55 AED
      NON_MEMBER: 25  // 90 AED
    },
    REFLEXOLOGY: {
      MEMBER: 15,     // 55 AED
      NON_MEMBER: 25  // 90 AED
    }
  },
  PACKAGES: {
    ONE_OFF: 40,     // 150 AED (day pass)
    WEEKLY: 90,      // 330 AED (3 sessions/1 week)
    BI_WEEKLY: 120   // 440 AED (6 sessions/2 weeks)
  },
  USD_TO_AED: 3.67
}

async function main() {
  // Create admin user (member)
  const adminPassword = await hash('yacht123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'azambata.1984@gmail.com' },
    update: {},
    create: {
      email: 'azambata.1984@gmail.com',
      name: 'Admin',
      password: adminPassword,
      role: UserRole.ADMIN,
      status: MembershipStatus.MEMBER,
      membershipStart: new Date(),
      membershipEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      activeBookingLimit: 3, // Max 3 active bookings
      preferredCurrency: Currency.USD,
    },
  })
  console.log('Admin user created:', admin)

  // Create demo weekday session
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(6, 0, 0, 0) // 6 AM weekday

  const weekdaySession = await prisma.session.upsert({
    where: {
      date_startTime: {
        date: tomorrow,
        startTime: tomorrow,
      }
    },
    update: {},
    create: {
      date: tomorrow,
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000), // 3 hours
      capacity: 100,
      availableSlots: 100,
      isWeekend: false,
      iceSlots: 9,     // 9 twenty-minute slots in 3 hours
      reflexSlots: 9,  // 9 twenty-minute slots in 3 hours
    },
  })
  console.log('Weekday session created:', weekdaySession)

  // Create demo weekend session
  const saturday = new Date()
  saturday.setDate(saturday.getDate() + (6 - saturday.getDay())) // Next Saturday
  saturday.setHours(9, 0, 0, 0) // 9 AM weekend

  const weekendSession = await prisma.session.upsert({
    where: {
      date_startTime: {
        date: saturday,
        startTime: saturday,
      }
    },
    update: {},
    create: {
      date: saturday,
      startTime: saturday,
      endTime: new Date(saturday.getTime() + 3 * 60 * 60 * 1000), // 3 hours
      capacity: 100,
      availableSlots: 100,
      isWeekend: true,
      iceSlots: 9,     // 9 twenty-minute slots in 3 hours
      reflexSlots: 9,  // 9 twenty-minute slots in 3 hours
    },
  })
  console.log('Weekend session created:', weekendSession)

  // Create a demo non-member with weekly package booking
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: await hash('demo123', 10),
      role: UserRole.USER,
      status: MembershipStatus.NON_MEMBER,
      preferredCurrency: Currency.AED,
    },
  })

  const packageBooking = await prisma.booking.create({
    data: {
      userId: demoUser.id,
      sessionId: weekdaySession.id,
      status: BookingStatus.CONFIRMED,
      currency: Currency.AED,
      bookingPackage: 'WEEKLY', // 3 sessions within 1 week
      basePrice: PRICES.PACKAGES.WEEKLY * PRICES.USD_TO_AED, // 330 AED
      drinkPackage: DrinkPackage.PREMIUM,
      drinkPrice: PRICES.DRINKS.PREMIUM * PRICES.USD_TO_AED, // 165 AED
      hasIceBath: true,
      iceSlotTime: new Date(tomorrow.getTime() + 20 * 60 * 1000), // First 20-min slot
      iceBathPrice: PRICES.EXPERIENCES.ICE_BATH.NON_MEMBER * PRICES.USD_TO_AED, // 90 AED
      totalPrice: (PRICES.PACKAGES.WEEKLY + PRICES.DRINKS.PREMIUM + PRICES.EXPERIENCES.ICE_BATH.NON_MEMBER) * PRICES.USD_TO_AED, // 585 AED
      notes: "Weekly package with premium drinks and ice bath",
    },
  })
  console.log('Demo package booking created:', packageBooking)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
