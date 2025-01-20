'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { VideoBackground } from './video-background'
import { TicketDownload } from './ticket-download'

interface DrinkPackage {
  id: string
  name: string
  priceAED: number
  priceUSD: number
  drinks: number
  description: string
  examples: string[]
}

interface CartItem {
  type: 'drink' | 'pass' | 'addon'
  package: DrinkPackage | PassPackage | Addon
}

interface PassPackage {
  id: string
  name: string
  priceAED: number
  priceUSD: number
  description: string
  features: string[]
}

interface Addon {
  id: string
  name: string
  priceAED: number
  priceUSD: number
  description: string
  image: string
  duration: string
}

const DRINK_PACKAGES: DrinkPackage[] = [
  {
    id: 'basic',
    name: 'Basic Package',
    priceAED: 90,
    priceUSD: 25,
    drinks: 2,
    description: 'Choose any 2 drinks from our premium selection',
    examples: [
      '2 adaptogenic drinks',
      '2 non-alcoholic cocktails',
      '1 adaptogen + 1 non-alcoholic'
    ],
  },
  {
    id: 'premium',
    name: 'Premium Package',
    priceAED: 150,
    priceUSD: 41,
    drinks: 4,
    description: 'Choose any 4 drinks from our premium selection',
    examples: [
      '4 adaptogenic drinks',
      '4 non-alcoholic cocktails',
      '2 adaptogens + 2 non-alcoholic'
    ],
  },
]

const DAY_PASS: PassPackage = {
  id: 'day',
  name: 'Day Pass',
  priceAED: 110,
  priceUSD: 30,
  description: 'Add a yacht session - book your preferred date later',
  features: [
    'Morning yacht session (6am-9am)',
    'Daily wellness activity',
    'Valid for 3 months',
    'Flexible scheduling',
  ],
}

const ICE_BATH: Addon = {
  id: 'ice',
  name: 'Ice Bath Experience',
  priceAED: 60,
  priceUSD: 16,
  description: 'Rejuvenate with our signature ice bath experience',
  image: '/wellness/ice3.webp',
  duration: '20 minutes',
}

export function DrinksPurchase() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [ticket, setTicket] = useState<any>(null) // Will show ticket after purchase

  const addToCart = (pkg: DrinkPackage) => {
    setCart([...cart, { type: 'drink', package: pkg }])
    toast({
      title: 'Added to cart',
      description: `${pkg.name} (${pkg.drinks} drinks) - ${pkg.priceAED} AED`,
    })
  }

  const addPassToCart = () => {
    setCart([...cart, { type: 'pass', package: DAY_PASS }])
    toast({
      title: 'Day Pass Added',
      description: `Morning yacht session added - ${DAY_PASS.priceAED} AED`,
    })
  }

  const addAddonToCart = (addon: Addon) => {
    setCart([...cart, { type: 'addon', package: addon }])
    toast({
      title: addon.name + ' Added',
      description: `${addon.duration} session - ${addon.priceAED} AED`,
    })
  }

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const hasPass = cart.some(item => item.type === 'pass')
  const hasIceBath = cart.some(item => item.type === 'addon' && item.package.id === 'ice')
  const hasDrinks = cart.some(item => item.type === 'drink')

  const checkout = async () => {
    try {
      const total = cart.reduce((sum, item) => sum + item.package.priceAED, 0)
      
      // Get drink package details
      const drinkItems = cart.filter(item => item.type === 'drink')
      const totalDrinks = drinkItems.reduce((sum, item) => sum + (item.package as DrinkPackage).drinks, 0)
      const hasBasic = drinkItems.some(item => item.package.priceAED === 90)
      const hasPremium = drinkItems.some(item => item.package.priceAED === 150)
      
      // Get add-ons
      const hasPass = cart.some(item => item.type === 'pass')
      const hasIceBath = cart.some(item => item.type === 'addon' && item.package.id === 'ice')

      // TODO: Replace with actual Stripe integration
      toast({
        title: 'Processing payment',
        description: `Total: ${total} AED`,
      })

      // Create booking and get ticket
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drinkPackage: hasPremium ? 'PREMIUM' : 'BASIC',
          drinkNotes: '',
          addOns: {
            dayPass: hasPass,
            iceBath: hasIceBath
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create booking')
      }

      const data = await response.json()
      setTicket(data.ticket)
      setCart([]) // Clear cart after successful purchase

      toast({
        title: 'Order confirmed!',
        description: 'Your ticket is ready to download.',
      })
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: 'Error processing order',
        description: 'Please try again or contact support.',
        variant: 'destructive'
      })
    }
  }

  // Show ticket if purchase is complete
  if (ticket) {
    return <TicketDownload ticket={ticket} />
  }

  return (
    <main className="relative min-h-screen">
      <VideoBackground />
      
      <div className="relative z-10 min-h-screen text-white p-8">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 p-6">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              ← Back to Home
            </Button>
          </Link>
        </nav>

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12 pt-16">
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100">
            Premium Drinks Menu
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience our curated selection of premium adaptogens and non-alcoholic cocktails
            at Dubai Creek. Mix and match to create your perfect morning combination.
          </p>
        </div>

        {/* Packages */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {DRINK_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="group bg-black/40 rounded-xl p-8 backdrop-blur-2xl border border-white/10 
                hover:border-white/20 transition-all duration-300 hover:shadow-2xl 
                hover:shadow-rose-500/20 hover:-translate-y-1"
            >
              <h2 className="text-2xl font-bold mb-2 group-hover:text-rose-300 transition-colors">
                {pkg.name}
              </h2>
              <div className="relative">
                <div className="flex flex-col mb-4">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-rose-300 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                      {pkg.priceAED} AED
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    (${pkg.priceUSD} USD)
                  </span>
                </div>
                {/* Price glow effect */}
                <div className="absolute -inset-1 bg-rose-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-gray-300 mb-4">{pkg.description}</p>
              <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold text-gray-300">Example combinations:</p>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                  {pkg.examples.map((example, i) => (
                    <li key={i} className="group-hover:text-gray-300 transition-colors">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => addToCart(pkg)}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20
                  transition-all duration-300 group-hover:shadow-xl group-hover:shadow-rose-500/30
                  hover:scale-[1.02] active:scale-100"
              >
                Add to Cart
              </Button>
            </div>
          ))}
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Upsell: Day Pass */}
            {!hasPass && hasDrinks && (
              <div className="bg-black/40 rounded-xl overflow-hidden backdrop-blur-2xl border border-white/10">
                <div className="relative h-32 bg-gradient-to-r from-rose-500/20 to-rose-500/5">
                  <div className="absolute inset-0 bg-[url('/wellness/boat back.webp')] bg-cover bg-center opacity-50 mix-blend-overlay" />
                  <div className="relative h-full flex items-center justify-between p-6">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Make it a Morning</h3>
                      <p className="text-gray-300 max-w-md">
                        Get a Day Pass now, book your preferred morning session later
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-bold text-rose-300 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)] mb-2">
                        {DAY_PASS.priceAED} AED
                      </div>
                      <Button
                        onClick={addPassToCart}
                        className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20
                          transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/30
                          hover:scale-[1.02] active:scale-100"
                      >
                        Add Day Pass
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-white/10">
                  <ul className="grid grid-cols-2 gap-3">
                    {DAY_PASS.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-rose-400 mt-1">✓</span>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Upsell: Ice Bath */}
            {hasPass && !hasIceBath && (
              <div className="bg-black/40 rounded-xl overflow-hidden backdrop-blur-2xl border border-white/10">
                <div className="relative h-48">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${ICE_BATH.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                  <div className="relative h-full flex items-center justify-between p-6">
                    <div className="max-w-md">
                      <h3 className="text-xl font-bold mb-2">{ICE_BATH.name}</h3>
                      <p className="text-gray-300 mb-4">{ICE_BATH.description}</p>
                      <p className="text-sm text-gray-400">{ICE_BATH.duration} session</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-bold text-rose-300 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)] mb-2">
                        {ICE_BATH.priceAED} AED
                      </div>
                      <Button
                        onClick={() => addAddonToCart(ICE_BATH)}
                        className="bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20
                          transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/30
                          hover:scale-[1.02] active:scale-100"
                      >
                        Add Ice Bath
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Summary */}
            <div className="bg-black/40 rounded-xl p-6 backdrop-blur-2xl border border-white/10">
              <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-white/10 last:border-0"
                >
                  <div>
                    <h3 className="font-bold">{item.package.name}</h3>
                    <p className="text-sm text-gray-300">{item.package.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-rose-300 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                        {item.package.priceAED} AED
                      </p>
                      <p className="text-sm text-gray-400">
                        (${item.package.priceUSD} USD)
                      </p>
                    </div>
                    <Button
                      onClick={() => removeFromCart(index)}
                      variant="ghost"
                      className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold">Total</p>
                  <p className="text-sm text-gray-300">
                    {cart.filter(item => item.type === 'drink').reduce((sum, item) => sum + (item.package as DrinkPackage).drinks, 0)} drinks
                    {hasPass && ' + Morning Session'}
                    {hasIceBath && ' + Ice Bath'}
                  </p>
                </div>
                <div className="relative text-right">
                  <p className="text-4xl font-bold text-rose-300 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                    {cart.reduce((sum, item) => sum + item.package.priceAED, 0)} AED
                  </p>
                  <p className="text-sm text-gray-400">
                    (${cart.reduce((sum, item) => sum + item.package.priceUSD, 0)} USD)
                  </p>
                  {/* Total price glow effect */}
                  <div className="absolute -inset-2 bg-rose-500/20 blur-xl rounded-full" />
                </div>
              </div>
              <Button
                onClick={checkout}
                className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white text-lg py-6
                  shadow-lg shadow-rose-500/20 transition-all duration-300 
                  hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-100"
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
