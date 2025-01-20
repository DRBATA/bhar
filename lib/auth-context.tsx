'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { MembershipStatus } from '@prisma/client'

interface AuthContextType {
  user: any | null
  isLoading: boolean
  isMember: boolean
  login: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  const value = {
    user: session?.user ?? null,
    isLoading: status === 'loading',
    isMember: session?.user?.membershipStatus === MembershipStatus.MEMBER,
    login: async (email: string, password: string) => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      if (result?.error) {
        throw new Error(result.error)
      }
    },
    signOut: async () => {
      await signOut()
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
