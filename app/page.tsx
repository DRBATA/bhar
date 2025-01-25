'use client'

import { useState } from 'react'
import { VideoIntro } from '@/components/video-intro'
import { useRouter } from 'next/navigation'

export default function IntroPage() {
  const [showRedirect, setShowRedirect] = useState(false)
  const router = useRouter()

  const handleIntroComplete = () => {
    setShowRedirect(true)
    setTimeout(() => {
      router.push('/home')
    }, 2000)
  }

  return (
    <main className="relative min-h-screen">
      <VideoIntro onEnter={handleIntroComplete} />
      
      {showRedirect && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="text-center text-white space-y-4">
            <p className="text-2xl">Welcome to The Morning Party</p>
            <p className="text-sm text-gray-400">Loading your experience...</p>
          </div>
        </div>
      )}
    </main>
  )
}
