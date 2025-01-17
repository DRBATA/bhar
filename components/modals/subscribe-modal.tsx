'use client'

import { useState } from 'react'
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface SubscribeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubscribe: () => void
}

export function SubscribeModal({ isOpen, onClose, onSubscribe }: SubscribeModalProps) {
  const [name, setName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !agreed) return

    setLoading(true)
    setTimeout(() => {
      onSubscribe()
      setLoading(false)
      setName('')
      setAgreed(false)
    }, 1000)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Subscribe to Morning Parties"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subscription Details */}
        <div className="space-y-4">
          <div className="relative p-6 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 shadow-xl overflow-hidden">
            {/* Geometric Accents */}
            <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-miami-sky/20 blur-xl" />
            <div className="absolute -left-16 -bottom-16 w-32 h-32 rounded-full bg-miami-coral/20 blur-xl" />
            
            {/* Content */}
            <div className="relative">
              <h3 className="text-xl font-medium tracking-wide text-miami-coral-dark drop-shadow-sm">
                Monthly Subscription
              </h3>
              <p className="mt-2 text-miami-coral-dark/90 font-medium">
                Join our exclusive wellness community for just 550 AED per month
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Access to all morning parties</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Book up to 3 slots in advance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Cancel or reschedule anytime</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-miami-coral-dark">✓</span>
                  <span className="text-miami-coral-dark/90 font-medium">Member-only experiences</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-miami-coral-dark/90 mb-2 drop-shadow-sm">
            Your Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="bg-white/20 border-white/30 focus:border-miami-coral/40 text-miami-coral-dark placeholder:text-miami-coral-dark/40 font-medium"
            required
          />
        </div>

        {/* Fair Use Policy */}
        <div className="space-y-4">
          <div className="flex items-start space-x-4 bg-white/10 rounded-lg p-4">
            <Checkbox
              id="policy"
              checked={agreed}
              onCheckedChange={setAgreed}
              className="mt-1"
            />
            <div className="space-y-3">
              <label htmlFor="policy" className="block text-sm text-miami-coral-dark/90 font-medium">
                I agree to the fair use policy, including:
              </label>
              <ul className="text-sm text-miami-coral-dark/80 list-disc list-inside space-y-1.5 font-medium">
                <li>Maximum 3 advance bookings at a time</li>
                <li>24-hour cancellation notice required</li>
                <li>Recurring monthly subscription of 550 AED</li>
                <li>Seasonal schedule variations may apply</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Subscribe Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-miami-coral to-miami-coral-dark hover:opacity-90 text-white font-medium tracking-wide shadow-lg"
          disabled={!name || !agreed || loading}
        >
          {loading ? 'Processing...' : 'Subscribe Now - 550 AED/month'}
        </Button>
      </form>
    </Modal>
  )
}
