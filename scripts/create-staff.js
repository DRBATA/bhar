const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
require('dotenv').config()

// Default test credentials if not in env
const STAFF_EMAIL = process.env.STAFF_EMAIL || 'admin@test.com'
const STAFF_PASSWORD = process.env.STAFF_PASSWORD || 'admin123'

async function main() {
  const prisma = new PrismaClient()

  try {
    const hashedPassword = await bcrypt.hash(STAFF_PASSWORD, 10)

    const staff = await prisma.user.create({
      data: {
        email: STAFF_EMAIL,
        name: 'Staff User',
        password: hashedPassword,
        role: 'STAFF',
        emailVerified: true,
        membershipStatus: 'NON_MEMBER'
      }
    })

    console.log('Staff user created:', staff)
    console.log('\nLogin credentials:')
    console.log('Email:', STAFF_EMAIL)
    console.log('Password:', STAFF_PASSWORD)
  } catch (error) {
    console.error('Error creating staff user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)
