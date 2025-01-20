export interface YachtSession {
  id: string
  date: Date
  startTime: Date
  endTime: Date
  capacity: number
  availableSlots: number
  isWeekend: boolean
  iceSlots: number
  reflexSlots: number
  bookings: Booking[]
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: string
  userId: string
  sessionId: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  currency: 'USD' | 'AED'
  bookingPackage?: 'ONE_OFF' | 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY'
  basePrice: number
  drinkPackage: 'NONE' | 'BASIC' | 'PREMIUM'
  drinkPrice: number
  drinkNotes?: string
  hasIceBath: boolean
  iceSlotTime?: Date
  iceBathPrice: number
  hasReflexology: boolean
  reflexSlotTime?: Date
  reflexPrice: number
  totalPrice: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  membershipType: 'NON_MEMBER' | 'MONTHLY'
  membershipStart?: Date
  membershipEnd?: Date
  sessionsLeft: number
  preferredCurrency: 'USD' | 'AED'
  bookings: Booking[]
  createdAt: Date
  updatedAt: Date
}
