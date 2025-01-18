import { NextResponse } from 'next/server'
import { sendDrinkConfirmation } from '@/lib/email'
import { getServerSession } from 'next-auth/next'

export async function POST(request: Request) {
  try {
    // Get user from session
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { order } = body

    // Validate order data
    if (!order || !order.package || !order.totalPrice || !order.drinks) {
      return NextResponse.json(
        { message: 'Invalid order data' },
        { status: 400 }
      )
    }

    // Send confirmation email
    await sendDrinkConfirmation(session.user.email, order)

    return NextResponse.json({ message: 'Confirmation email sent' })
  } catch (error) {
    console.error('Error sending drink confirmation:', error)
    return NextResponse.json(
      { message: 'Failed to send confirmation email' },
      { status: 500 }
    )
  }
}
