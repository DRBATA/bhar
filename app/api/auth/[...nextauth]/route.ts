import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          membershipStatus: user.membershipStatus
        }
      }
    })
  ],
  pages: {
    signIn: '/',
    error: '/'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.membershipStatus = user.membershipStatus
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role
        session.user.membershipStatus = token.membershipStatus
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === 'development'
})

export { handler as GET, handler as POST }
