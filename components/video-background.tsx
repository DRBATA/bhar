'use client'

export function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Static image background */}
      <img 
        src="/drinks/mainbackroudnnew.png" 
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Video overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-20"
      >
        <source src="/glass.mp4" type="video/mp4" />
      </video>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 backdrop-blur-[1px]" />
    </div>
  )
}
