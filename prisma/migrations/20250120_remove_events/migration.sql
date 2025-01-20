-- Drop foreign key constraints first
ALTER TABLE "EventSchedule" DROP CONSTRAINT "EventSchedule_eventId_fkey";
ALTER TABLE "BookingEvent" DROP CONSTRAINT "BookingEvent_eventId_fkey";
ALTER TABLE "BookingEvent" DROP CONSTRAINT "BookingEvent_scheduleId_fkey";

-- Drop tables
DROP TABLE "BookingEvent";
DROP TABLE "EventSchedule";
DROP TABLE "Event";

-- Drop enums
DROP TYPE "EventType";
DROP TYPE "EventCategory";
