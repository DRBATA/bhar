import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type DrinkWithDetails = {
  drink: {
    id: string
    name: string
    description: string
  }
  quantity: number
}

type PackageWithDrinks = {
  id: string
  name: string
  description: string
  memberPrice: number
  nonMemberPrice: number
  drinks: DrinkWithDetails[]
}

type PrismaPackage = {
  id: string
  name: string
  description: string
  memberPrice: number
  nonMemberPrice: number
  drinks: {
    drink: {
      id: string
      name: string
      description: string
    }
    quantity: number
  }[]
}

export async function GET() {
  try {
    console.log('Fetching packages...')
    const packages = await prisma.package.findMany({
      where: {
        type: {
          in: ['YACHT_DRINKS', 'YACHT_FULL']
        }
      },
      include: {
        drinks: {
          include: {
            drink: true
          }
        }
      },
      orderBy: {
        memberPrice: 'asc'
      }
    })

    console.log('Found packages:', JSON.stringify(packages, null, 2))

    // Transform the data to match the frontend interface
    const transformedPackages = packages.map((pkg: PrismaPackage) => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      memberPrice: pkg.memberPrice,
      nonMemberPrice: pkg.nonMemberPrice,
      drinks: pkg.drinks.map((d: { drink: { id: string; name: string; description: string }; quantity: number }) => ({
        drink: {
          id: d.drink.id,
          name: d.drink.name,
          description: d.drink.description
        },
        quantity: d.quantity
      }))
    })) satisfies PackageWithDrinks[]

    console.log('Transformed packages:', JSON.stringify(transformedPackages, null, 2))
    return NextResponse.json(transformedPackages)
  } catch (error) {
    console.error('Error in packages API:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to fetch packages',
        details: error instanceof Error ? error.message : String(error)
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
