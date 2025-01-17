'use client'

import { useState } from 'react'
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { EventType } from '@prisma/client'

interface Event {
  id: string
  type: EventType
  name: string
  description: string
  capacity: number
  memberPrice: number
  nonMemberPrice: number
}

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event
  onSchedule: (dates: Date[], startTime: string, endTime: string, capacity?: number) => Promise<void>
}

export function ScheduleModal({ isOpen, onClose, event, onSchedule }: ScheduleModalProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [startTime, setStartTime] = useState('06:00')
  const [endTime, setEndTime] = useState('09:00')
  const [capacity, setCapacity] = useState(event.capacity.toString())
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDates.length || !startTime || !endTime) return

    setLoading(true)
    try {
      await onSchedule(
        selectedDates,
        startTime,
        endTime,
        capacity ? parseInt(capacity) : undefined
      )
      onClose()
    } catch (error) {
      console.error('Error creating schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Schedule ${event.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details */}
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="font-medium mb-2">{event.name}</h3>
          <div className="text-sm text-white/60 space-y-1">
            <p>Default Capacity: {event.capacity}</p>
            <p>Member Price: {event.memberPrice} AED</p>
            <p>Non-Member Price: {event.nonMemberPrice} AED</p>
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Dates
          </label>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates as any}
            className="rounded-md border"
            disabled={(date) => date < new Date()}
          />
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium mb-2">
              Start Time
            </label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-white/10"
              required
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium mb-2">
              End Time
            </label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="bg-white/10"
              required
            />
          </div>
        </div>

        {/* Capacity Override */}
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium mb-2">
            Capacity (Optional Override)
          </label>
          <Input
            id="capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="bg-white/10"
            min="1"
            placeholder={`Default: ${event.capacity}`}
          />
        </div>

        {/* Summary */}
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="font-medium mb-2">Schedule Summary</h4>
          <ul className="text-sm space-y-1 text-white/60">
            <li>Dates Selected: {selectedDates.length}</li>
            <li>Time: {startTime} - {endTime}</li>
            <li>Capacity: {capacity || event.capacity} per session</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!selectedDates.length || loading}
          >
            {loading ? 'Creating...' : 'Create Schedules'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
