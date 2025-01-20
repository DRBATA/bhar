import { Prisma, MembershipStatus, BookingStatus, DrinkPackage } from '@prisma/client'

// Booking creation request type
export interface CreateBookingRequest {
  sessionId: string
  drinkPackage?: 'BASIC' | 'PREMIUM' | null
  addOns: {
    iceBath: boolean
    reflexology: boolean
  }
}

// API response types with relations
export type BookingWithDetails = Prisma.BookingGetPayload<{
  select: {
    id: true
    status: true
    isCancellable: true
    isComplete: true
    drinkPackage: true
    hasIceBath: true
    hasReflexology: true
    totalPrice: true
    sessionId: true
    user: {
      select: {
        id: true
        email: true
        status: true
      }
    }
    session: {
      select: {
        id: true
        date: true
        startTime: true
        endTime: true
        availableSlots: true
        iceSlots: true
        reflexSlots: true
        isCancellable: true
        isPast: true
      }
    }
  }
}>

// Helper types for API responses
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export type BookingResponse = ApiResponse<BookingWithDetails>
export type BookingsListResponse = ApiResponse<BookingWithDetails[]>

// Price calculation helpers
export interface PriceBreakdown {
  basePrice: number
  drinkPrice: number
  addOnPrices: {
    iceBath?: number
    reflexology?: number
  }
  totalPrice: number
  currency: 'USD' | 'AED'
}

// Session availability check
export interface SessionAvailability {
  hasSlots: boolean
  hasIceSlots: boolean
  hasReflexSlots: boolean
  nextAvailableDate?: Date
}

// Booking validation
export interface BookingValidation {
  canBook: boolean
  activeBookings: number
  maxBookings: number
  errors?: string[]
}

// Currency enum (keeping for now until payment integration)
export enum Currency {
  USD = 'USD',
  AED = 'AED'
}

// Prisma select types for common queries
export const bookingWithDetailsSelect = {
  id: true,
  status: true,
  isCancellable: true,
  isComplete: true,
  drinkPackage: true,
  hasIceBath: true,
  hasReflexology: true,
  totalPrice: true,
  sessionId: true,
  user: {
    select: {
      id: true,
      email: true,
      status: true
    }
  },
  session: {
    select: {
      id: true,
      date: true,
      startTime: true,
      endTime: true,
      availableSlots: true,
      iceSlots: true,
      reflexSlots: true,
      isCancellable: true,
      isPast: true
    }
  }
} as const
