'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface Booking {
  id: string
  date: string
  time: string
  experiences: string[]
  drinks: string[]
}

// Demo data
const upcomingBookings: Booking[] = [
  {
    id: '1',
    date: 'January 25, 2024',
    time: '6:00 AM - 9:00 AM',
    experiences: ['Morning Yoga', 'Ice Bath'],
    drinks: ['Sunrise Elixir', 'Recovery Tonic']
  },
  {
    id: '2',
    date: 'January 28, 2024',
    time: '6:00 AM - 9:00 AM',
    experiences: ['Meditation', 'Reflexology'],
    drinks: ['Energy Boost', 'Calm Mind']
  }
]

const pastBookings: Booking[] = [
  {
    id: '3',
    date: 'January 15, 2024',
    time: '6:00 AM - 9:00 AM',
    experiences: ['Functional Fitness', 'Ice Bath'],
    drinks: ['Power Up', 'Cool Down']
  }
]

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-miami-sky-light to-miami-sky px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-medium tracking-wide text-miami-coral-dark drop-shadow-md mb-4">
            Members Dashboard
          </h1>
          <p className="text-miami-coral-dark/90 font-medium">
            Welcome back! Manage your bookings and enjoy exclusive member benefits.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Member Status */}
          <div className="space-y-8">
            {/* Membership Card */}
            <div className="relative p-6 rounded-lg bg-gradient-to-br from-miami-coral/20 to-miami-sky/20 border border-white/30 backdrop-blur-md shadow-xl overflow-hidden">
              <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-miami-coral/20 blur-xl" />
              <div className="relative">
                <h3 className="text-xl font-medium text-miami-coral-dark mb-4">
                  Active Membership
                </h3>
                <div className="space-y-2 text-miami-coral-dark/90 font-medium">
                  <div>Next Renewal: February 15, 2024</div>
                  <div>Member Since: January 1, 2024</div>
                </div>
              </div>
            </div>

            {/* Member Benefits */}
            <div className="p-6 rounded-lg bg-white/20 border border-white/30 backdrop-blur-md shadow-xl">
              <h3 className="text-xl font-medium text-miami-coral-dark mb-4">
                Your Benefits
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">20% off all experiences</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">15% off all drinks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Unlimited bookings</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Priority booking access</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Middle Column - Upcoming Bookings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium text-miami-coral-dark">
                Upcoming Bookings
              </h3>
              <Link href="/booking">
                <Button className="bg-gradient-to-r from-miami-coral to-miami-coral-dark hover:opacity-90 text-white font-medium shadow-lg">
                  Book New
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div 
                  key={booking.id}
                  className="p-4 rounded-lg bg-white/20 border border-white/30 backdrop-blur-md shadow-lg"
                >
                  <div className="text-miami-coral-dark font-medium mb-2">
                    {booking.date}
                  </div>
                  <div className="text-miami-coral-dark/80 text-sm mb-3">
                    {booking.time}
                  </div>
                  {booking.experiences.length > 0 && (
                    <div className="mb-2">
                      <div className="text-miami-coral-dark/90 font-medium text-sm mb-1">
                        Experiences:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {booking.experiences.map((exp, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 rounded bg-miami-coral/10 text-miami-coral-dark text-sm font-medium"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {booking.drinks.length > 0 && (
                    <div>
                      <div className="text-miami-coral-dark/90 font-medium text-sm mb-1">
                        Drinks:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {booking.drinks.map((drink, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 rounded bg-miami-sky/10 text-miami-coral-dark text-sm font-medium"
                          >
                            {drink}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Past Bookings */}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-miami-coral-dark">
              Past Bookings
            </h3>
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <div 
                  key={booking.id}
                  className="p-4 rounded-lg bg-white/10 border border-white/20 backdrop-blur-md"
                >
                  <div className="text-miami-coral-dark/80 font-medium mb-2">
                    {booking.date}
                  </div>
                  <div className="text-miami-coral-dark/70 text-sm mb-3">
                    {booking.time}
                  </div>
                  {booking.experiences.length > 0 && (
                    <div className="mb-2">
                      <div className="text-miami-coral-dark/80 font-medium text-sm mb-1">
                        Experiences:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {booking.experiences.map((exp, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 rounded bg-miami-coral/5 text-miami-coral-dark/70 text-sm font-medium"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {booking.drinks.length > 0 && (
                    <div>
                      <div className="text-miami-coral-dark/80 font-medium text-sm mb-1">
                        Drinks:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {booking.drinks.map((drink, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 rounded bg-miami-sky/5 text-miami-coral-dark/70 text-sm font-medium"
                          >
                            {drink}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
