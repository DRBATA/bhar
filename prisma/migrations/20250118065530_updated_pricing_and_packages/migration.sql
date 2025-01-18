-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('NON_MEMBER', 'MEMBER');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('YACHT_SESSION', 'SOBER_RAVE', 'YOGA', 'FUNCTIONAL_FITNESS', 'ICE_BATH', 'REFLEXOLOGY');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('WELLNESS', 'ADD_ON');

-- CreateEnum
CREATE TYPE "DrinkPackage" AS ENUM ('BASIC', 'PREMIUM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "membershipStatus" "MembershipStatus" NOT NULL DEFAULT 'NON_MEMBER',
    "membershipStart" TIMESTAMP(3),
    "membershipEnd" TIMESTAMP(3),
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifyToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "category" "EventCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "memberPrice" DOUBLE PRECISION NOT NULL,
    "nonMemberPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSchedule" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "wellnessEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "membershipAtBooking" "MembershipStatus" NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "drinkPackage" "DrinkPackage",
    "drinkNotes" TEXT,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "addOns" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingEvent" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT,
    "eventId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_verifyToken_key" ON "User"("verifyToken");

-- CreateIndex
CREATE UNIQUE INDEX "EventSchedule_eventId_date_startTime_key" ON "EventSchedule"("eventId", "date", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "BookingEvent_bookingId_eventId_scheduleId_key" ON "BookingEvent"("bookingId", "eventId", "scheduleId");

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingEvent" ADD CONSTRAINT "BookingEvent_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingEvent" ADD CONSTRAINT "BookingEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingEvent" ADD CONSTRAINT "BookingEvent_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "EventSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
