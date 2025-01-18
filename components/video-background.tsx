'use client'

export function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Static image background */}
      <picture>
        <source srcSet="/drinks/drinks.webp" type="image/webp" />
        <img 
          src="/drinks/drinkfallback.jpeg" 
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>
      
      {/* Video overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
      >
        <source src="/glass.mp4" type="video/mp4" />
      </video>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[1px]" />
    </div>
  )
}
