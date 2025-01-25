'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function UpcomingPartyModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(0)

  // Show modal on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 500) // Small delay to let page load
    return () => clearTimeout(timer)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-black/90 border-rose-500/20 max-w-xl">
          <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100">
            SUNDAY MORNING BOAT PARTY
          </h2>
          <p className="text-gray-300 mb-6">by The Water Bar — a blended, luxury wellness experience for the mind, body, and soul.</p>
          
          {/* Horizontal Scrolling Content */}
          <div className="relative">
            <div 
              className="overflow-x-auto snap-x snap-mandatory flex space-x-4 pb-4 -mx-2 px-2"
              onScroll={(e) => {
                const target = e.target as HTMLDivElement
                const section = Math.round(target.scrollLeft / target.clientWidth)
                setActiveSection(section)
              }}
            >
              {/* Section 1: Event Details */}
              <div className="flex-none w-full snap-center space-y-4 text-gray-300">
                <div className="space-y-2">
                  <p>🗓️ Sunday, 26 Jan</p>
                  <p>🕘 9am — 12pm (noon)</p>
                  <p>📍 Dubai Creek Harbour (Secret Ocean Yacht) 🛥️</p>
                </div>
                <div className="space-y-2">
                  <p>🎧 DJ: <span className="text-rose-300">Vic Halley</span> @iamvichalley</p>
                  <p>💡 Curator: @inspiredbeingco</p>
                </div>
              </div>

              {/* Section 2: Activities */}
              <div className="flex-none w-full snap-center space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-rose-300">✨ Immerse yourself in:</h3>
                <ul className="space-y-2 list-inside">
                  <li>• Sober rave and uplifting dance</li>
                  <li>• Ice baths to recharge and revitalize</li>
                  <li>• Breathwork for focus and emotional balance</li>
                  <li>• Yoga to awaken and energize</li>
                  <li>• Sacred cacao ceremonies and more</li>
                </ul>
              </div>

              {/* Section 3: Important Info */}
              <div className="flex-none w-full snap-center space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-rose-300">Important:</h3>
                <ul className="space-y-2">
                  <li>🛥️ The boat sails from 10am to 11am</li>
                  <li>👙 Bring your wet outfit</li>
                </ul>
                <p className="italic text-sm">
                  This is a safe space to let go and connect. Embrace the energy of dry January with our refreshing, 
                  non-alcoholic bar.
                </p>
              </div>

              {/* Section 4: Pricing */}
              <div className="flex-none w-full snap-center space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-rose-300">Join Us:</h3>
                <ul className="space-y-2">
                  <li>• Day passes ($65 - entry only)</li>
                  <li>• Subscriptions ($150/month - includes experiences)</li>
                </ul>
                <p className="text-sm text-rose-300">https://thewaterbar.ae/register</p>
                <p className="text-sm">Whatsapp: <span className="text-rose-300">+44 20 8133 6235</span></p>
              </div>
            </div>

            {/* Scroll Indicators */}
            <div className="flex justify-center space-x-2 mt-4">
              {[0, 1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i === activeSection ? 'bg-rose-500' : 'bg-rose-500/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => {
                setIsOpen(false)
                setActiveSection(0) // Reset to first section when closing
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2"
            >
              Explore Experiences
            </Button>
          </div>
      </DialogContent>
    </Dialog>
  )
}
