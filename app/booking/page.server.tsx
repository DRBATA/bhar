import { getServerSession } from 'next-auth/next'
import prisma from '@/lib/prisma'

export type YachtSessionWithAvailability = {
  id: string
  date: Date
  startTime: Date
  endTime: Date
  capacity: number
  availableSlots: number
  isWeekend: boolean
  iceSlots: number
  reflexSlots: number
}

export async function getUpcomingSessions() {
  return (await prisma.$queryRaw`
    SELECT 
      id, 
      date, 
      "startTime",
      "endTime",
      capacity,
      "availableSlots",
      "isWeekend",
      "iceSlots",
      "reflexSlots"
    FROM "YachtSession"
    WHERE date >= CURRENT_DATE
    AND "availableSlots" > 0
    ORDER BY date ASC
  `) as YachtSessionWithAvailability[]
}

export async function getUserSession() {
  return await getServerSession()
}
