import { UserRole, MembershipStatus } from '@prisma/client'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    role: UserRole
    membershipStatus: MembershipStatus
  }

  interface Session {
    user: User & {
      role: UserRole
      membershipStatus: MembershipStatus
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    membershipStatus: MembershipStatus
  }
}
