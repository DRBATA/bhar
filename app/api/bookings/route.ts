import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

interface PackageDrink {
  drink: {
    name: string
  }
  quantity: number
}

interface PackageWithDrinks {
  id: string
  name: string
  memberPrice: number
  nonMemberPrice: number
  drinks: PackageDrink[]
}

export async function POST(request: Request) {
  try {
    // Get user from session
    const userResponse = await fetch('http://localhost:3000/api/user')
    const userData = await userResponse.json()

    if (!userResponse.ok) {
      return new NextResponse(
        JSON.stringify({ error: 'User not authenticated' }),
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { packageId, date } = body

    if (!packageId || !date) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      )
    }

    // Get package details
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        drinks: {
          include: {
            drink: true
          }
        }
      }
    }) as PackageWithDrinks | null

    if (!pkg) {
      return new NextResponse(
        JSON.stringify({ error: 'Package not found' }),
        { status: 404 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: userData.id,
        date: new Date(date),
        membershipAtBooking: userData.membershipStatus,
        status: 'PENDING_PAYMENT',
        finalPrice: userData.membershipStatus === 'MEMBER' ? pkg.memberPrice : pkg.nonMemberPrice,
        packages: {
          create: {
            packageId: pkg.id,
            finalPrice: userData.membershipStatus === 'MEMBER' ? pkg.memberPrice : pkg.nonMemberPrice
          }
        }
      }
    })

    // Send confirmation email
    await sendEmail({
      to: userData.email,
      subject: 'Booking Confirmation',
      html: `
        <h1>Booking Confirmation</h1>
        <p>Thank you for booking ${pkg.name}!</p>
        <p>Your booking details:</p>
        <ul>
          <li>Date: ${new Date(date).toLocaleDateString()}</li>
          <li>Package: ${pkg.name}</li>
          <li>Price: ${booking.finalPrice} AED</li>
        </ul>
        <h2>Included Drinks:</h2>
        <ul>
          ${pkg.drinks.map((d: PackageDrink) => `
            <li>${d.drink.name}: ${d.quantity === -1 ? 'Unlimited' : `${d.quantity}x`}</li>
          `).join('')}
        </ul>
        <p>Please note:</p>
        <ul>
          <li>Valid for the booked date only</li>
          <li>Drinks must be consumed during your visit</li>
          <li>Non-transferable and non-refundable</li>
        </ul>
      `
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error creating booking:', error)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to create booking',
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    )
  }
}
