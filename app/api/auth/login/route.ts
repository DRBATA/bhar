import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcrypt'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })

  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { message: 'Failed to login' },
      { status: 500 }
    )
  }
}
