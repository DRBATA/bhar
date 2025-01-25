// Package types
export interface DrinkPackage {
  id: string
  name: string
  priceAED: number
  priceUSD: number
  drinks: number
  description: string
  examples: string[]
}

export interface PassPackage {
  id: string
  name: string
  priceAED: number
  priceUSD: number
  description: string
  features: string[]
}

export interface Addon {
  id: string
  name: string
  priceAED: number
  priceUSD: number
  description: string
  image: string
  duration: string
}

// Cart types
export interface CartItem {
  type: 'drink' | 'pass' | 'addon'
  package: DrinkPackage | PassPackage | Addon
}

// Ticket types
export interface Ticket {
  id: string
  items: CartItem[]
  totalAED: number
  totalUSD: number
  createdAt: string
  validUntil: string
}
