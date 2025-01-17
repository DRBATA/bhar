const { PrismaClient, UserRole, MembershipStatus } = require('@prisma/client')

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  membershipStatus: MembershipStatus
  emailVerified: boolean
  createdAt: Date
}

async function main() {
  const prisma = new PrismaClient()

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        membershipStatus: true,
        emailVerified: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('\nUsers:', users.map((user: User) => ({
      ...user,
      createdAt: user.createdAt.toLocaleString()
    })))
    
    console.log('\nTotal users:', users.length)

    // Print stats
    const stats = {
      staff: users.filter((u: User) => u.role === 'STAFF').length,
      members: users.filter((u: User) => u.membershipStatus === 'MEMBER').length,
      premium: users.filter((u: User) => u.membershipStatus === 'PREMIUM').length,
      verified: users.filter((u: User) => u.emailVerified).length
    }

    console.log('\nStats:', stats)

  } catch (error) {
    console.error('Error listing users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)
