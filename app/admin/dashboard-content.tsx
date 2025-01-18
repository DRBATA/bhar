'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { ScheduleModal } from '@/components/modals/schedule-modal'
import { EventType } from '@prisma/client'

type TabType = 'bookings' | 'events' | 'members'

interface Event {
  id: string
  type: EventType
  name: string
  description: string
  capacity: number
  memberPrice: number
  nonMemberPrice: number
}

interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

const TabButton = ({ active, onClick, children }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-colors ${
      active 
        ? 'bg-miami-coral text-white' 
        : 'bg-white/10 text-white/60 hover:bg-white/20'
    }`}
  >
    {children}
  </button>
)

export default function DashboardContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('events')
  const [loading, setLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  const handleScheduleEvent = async (
    dates: Date[],
    startTime: string,
    endTime: string,
    capacity?: number
  ) => {
    if (!selectedEvent) return

    try {
      const response = await fetch('/api/admin/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          dates,
          startTime,
          endTime,
          capacity
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create schedules')
      }

      // Could refresh event data here if needed
    } catch (error) {
      console.error('Error scheduling event:', error)
      throw error
    }
  }

  const openScheduleModal = (event: Event) => {
    setSelectedEvent(event)
    setShowScheduleModal(true)
  }

  if (!user || user.role !== 'STAFF') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">Access denied. Staff only area.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="text-white/60">
            Logged in as <span className="text-white">{user.name}</span>
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8">
        <TabButton 
          active={activeTab === 'events'} 
          onClick={() => setActiveTab('events')}
        >
          Events & Classes
        </TabButton>
        <TabButton 
          active={activeTab === 'members'} 
          onClick={() => setActiveTab('members')}
        >
          Members
        </TabButton>
        <TabButton 
          active={activeTab === 'bookings'} 
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </TabButton>
      </div>

      {/* Content Area */}
      <div className="bg-white/5 rounded-xl p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">Events & Classes</h2>
                  <Button>Add New Event</Button>
                </div>
                
                {/* Event Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Yacht Session */}
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="font-medium mb-2">Yacht Session</h3>
                    <div className="space-y-2 text-sm text-white/60">
                      <p>Capacity: 100</p>
                      <p>Duration: 3 hours</p>
                      <p>Member Price: 150 AED</p>
                      <p>Non-Member Price: 200 AED</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full"
                      onClick={() => openScheduleModal({
                        id: '1',
                        type: 'YACHT_SESSION',
                        name: 'Yacht Session',
                        description: 'Start your day with energy and good vibes',
                        capacity: 100,
                        memberPrice: 150,
                        nonMemberPrice: 200
                      })}
                    >
                      Edit Schedule
                    </Button>
                  </div>

                  {/* Sober Rave */}
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="font-medium mb-2">Sober Rave</h3>
                    <div className="space-y-2 text-sm text-white/60">
                      <p>Capacity: 100</p>
                      <p>Duration: 3 hours</p>
                      <p>Member Price: Free</p>
                      <p>Non-Member Price: 50 AED</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full"
                      onClick={() => openScheduleModal({
                        id: '2',
                        type: 'SOBER_RAVE',
                        name: 'Sober Rave',
                        description: 'Dance as the sun rises',
                        capacity: 100,
                        memberPrice: 0,
                        nonMemberPrice: 50
                      })}
                    >
                      Edit Schedule
                    </Button>
                  </div>

                  {/* Yoga */}
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="font-medium mb-2">Yoga</h3>
                    <div className="space-y-2 text-sm text-white/60">
                      <p>Capacity: 20</p>
                      <p>Duration: 1 hour</p>
                      <p>Member Price: 75 AED</p>
                      <p>Non-Member Price: 100 AED</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full"
                      onClick={() => openScheduleModal({
                        id: '3',
                        type: 'YOGA',
                        name: 'Yoga',
                        description: 'Start your morning with mindful movements',
                        capacity: 20,
                        memberPrice: 75,
                        nonMemberPrice: 100
                      })}
                    >
                      Edit Schedule
                    </Button>
                  </div>
                </div>

                {/* Schedule Calendar */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Upcoming Schedule</h3>
                  <div className="bg-white/10 rounded-lg p-6">
                    {/* Calendar will go here */}
                    <p className="text-white/60">Calendar integration coming soon...</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">Members</h2>
                  <div className="flex gap-4">
                    <Button variant="outline">Export Data</Button>
                    <Button>Add Member</Button>
                  </div>
                </div>

                {/* Member Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-sm text-white/60 mb-2">Active Members</h3>
                    <p className="text-3xl font-medium">247</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-sm text-white/60 mb-2">New This Month</h3>
                    <p className="text-3xl font-medium">12</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-sm text-white/60 mb-2">Renewal Rate</h3>
                    <p className="text-3xl font-medium">94%</p>
                  </div>
                </div>

                {/* Member List */}
                <div className="bg-white/10 rounded-lg p-6">
                  <p className="text-white/60">Member list integration coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">Bookings</h2>
                  <Button>Create Booking</Button>
                </div>

                {/* Booking Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-sm text-white/60 mb-2">Today's Bookings</h3>
                    <p className="text-3xl font-medium">24</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-sm text-white/60 mb-2">This Week</h3>
                    <p className="text-3xl font-medium">156</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-sm text-white/60 mb-2">Capacity</h3>
                    <p className="text-3xl font-medium">78%</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-6">
                    <h3 className="text-sm text-white/60 mb-2">Waitlist</h3>
                    <p className="text-3xl font-medium">5</p>
                  </div>
                </div>

                {/* Booking List */}
                <div className="bg-white/10 rounded-lg p-6">
                  <p className="text-white/60">Booking list integration coming soon...</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Schedule Modal */}
      {selectedEvent && (
        <ScheduleModal
          isOpen={showScheduleModal}
          onClose={() => {
            setShowScheduleModal(false)
            setSelectedEvent(null)
          }}
          event={selectedEvent}
          onSchedule={handleScheduleEvent}
        />
      )}
    </div>
  )
}
