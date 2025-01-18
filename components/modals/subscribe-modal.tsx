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
          <div className="relative p-6 rounded-lg bg-black/40 backdrop-blur-2xl border border-white/10 shadow-xl overflow-hidden">
            {/* Geometric Accents */}
            <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl" />
            <div className="absolute -left-16 -bottom-16 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl" />
            
            {/* Content */}
            <div className="relative">
              <h3 className="text-xl font-bold tracking-wide text-white mb-2">
                Monthly Subscription
              </h3>
              <div className="flex flex-col mb-4">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-rose-300 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                    550 AED
                  </span>
                </div>
                <span className="text-gray-400 text-sm">
                  ($150 USD)
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="text-rose-400 mt-1">✓</span>
                  <span className="text-gray-300">Up to 3 active bookings at a time</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-400 mt-1">✓</span>
                  <span className="text-gray-300">Book new slots as you use them</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-400 mt-1">✓</span>
                  <span className="text-gray-300">1/3 off all experiences</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-400 mt-1">✓</span>
                  <span className="text-gray-300">Access to daily wellness activities</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-400 mt-1">✓</span>
                  <span className="text-gray-300">Cancel or reschedule anytime</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Your Name
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="bg-black/20 border-white/10 focus:border-rose-500/40 text-white placeholder:text-white/40"
            required
          />
        </div>

        {/* Fair Use Policy */}
        <div className="space-y-4">
          <div className="flex items-start space-x-4 bg-black/20 rounded-lg p-4">
            <Checkbox
              id="policy"
              checked={agreed}
              onCheckedChange={setAgreed}
              className="mt-1"
            />
            <div className="space-y-3">
              <label htmlFor="policy" className="block text-sm text-white font-medium">
                I agree to the fair use policy, including:
              </label>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-1.5">
                <li>Maximum 3 active bookings at a time</li>
                <li>24-hour cancellation notice required</li>
                <li>Recurring monthly subscription of 550 AED ($150)</li>
                <li>Seasonal schedule variations may apply</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Subscribe Button */}
        <Button
          type="submit"
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium tracking-wide 
            shadow-lg shadow-rose-500/20 transition-all duration-300 
            hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-100"
          disabled={!name || !agreed || loading}
        >
          {loading ? 'Processing...' : 'Subscribe Now - 550 AED/month'}
        </Button>
      </form>
    </Modal>
  )
}
