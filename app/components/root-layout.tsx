'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoginModal } from '@/components/modals/login-modal'
import { SubscribeModal } from '@/components/modals/subscribe-modal'

export function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSubscribeModal, setShowSubscribeModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-4 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Nav */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-miami-coral-dark font-medium hover:text-miami-coral transition-colors"
            >
              About Us
            </Link>
            <Link 
              href="/packages" 
              className="text-miami-coral-dark font-medium hover:text-miami-coral transition-colors"
            >
              Day Passes
            </Link>
            <Link 
              href="/booking" 
              className="text-miami-coral-dark font-medium hover:text-miami-coral transition-colors"
            >
              Book Now
            </Link>
            {isSubscribed && (
              <Link 
                href="/members" 
                className="text-miami-coral-dark font-medium hover:text-miami-coral transition-colors"
              >
                Members Area
              </Link>
            )}
          </div>

          {/* Right Nav */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-miami-sky-dark to-miami-sky hover:opacity-90 text-white font-medium shadow-lg"
                >
                  Login
                </Button>
                <Button
                  onClick={() => setShowSubscribeModal(true)}
                  className="bg-gradient-to-r from-miami-coral to-miami-coral-dark hover:opacity-90 text-white font-medium shadow-lg"
                >
                  Subscribe Now
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setIsLoggedIn(false)
                  setIsSubscribed(false)
                }}
                className="bg-gradient-to-r from-miami-sky-dark to-miami-sky hover:opacity-90 text-white font-medium shadow-lg"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => {
          setIsLoggedIn(true)
          setShowLoginModal(false)
        }}
      />

      <SubscribeModal 
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        onSubscribe={() => {
          setIsSubscribed(true)
          setShowSubscribeModal(false)
        }}
      />
    </>
  )
}
