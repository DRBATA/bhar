import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { randomBytes } from 'crypto'
import { hash } from 'bcrypt'

// For a real app, use proper email service
async function sendResetEmail(email: string, resetToken: string) {
  console.log(`Reset link: /reset-password?token=${resetToken}`)
  // TODO: Implement email sending
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Don't reveal if user exists
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' })
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Save reset token
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Send reset email
    await sendResetEmail(email, resetToken)

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { message: 'Something went wrong.' },
      { status: 500 }
    )
  }
}

// Handle password reset
export async function PUT(request: Request) {
  try {
    const { token, newPassword } = await request.json()

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token.' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10)

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json({ message: 'Password updated successfully.' })

  } catch (error) {
    console.error('Password update error:', error)
    return NextResponse.json(
      { message: 'Something went wrong.' },
      { status: 500 }
    )
  }
}
