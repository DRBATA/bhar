const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const PASSES = [
  {
    type: 'YACHT_DRINKS',
    name: 'Basic Day Pass',
    description: 'Access to the water bar including: 2 waters, 1 adaptogen, and 1 non-alcoholic drink',
    memberPrice: 150,
    nonMemberPrice: 150,
    drinks: [
      { name: 'Mineral Water', quantity: 2 },
      { name: 'Daily Adaptogen', quantity: 1 },
      { name: 'Signature Mocktail', quantity: 1 }
    ]
  },
  {
    type: 'YACHT_DRINKS',
    name: 'Premium Day Pass',
    description: 'Access to the water bar including: unlimited water, 2 adaptogens, and 2 non-alcoholic drinks',
    memberPrice: 275,
    nonMemberPrice: 275,
    drinks: [
      { name: 'Mineral Water', quantity: -1 }, // -1 indicates unlimited
      { name: 'Daily Adaptogen', quantity: 2 },
      { name: 'Signature Mocktail', quantity: 2 }
    ]
  },
  {
    type: 'YACHT_FULL',
    name: 'VIP Day Pass',
    description: 'Full access to the water bar with unlimited drinks of all types',
    memberPrice: 495,
    nonMemberPrice: 495,
    drinks: [
      { name: 'Mineral Water', quantity: -1 },
      { name: 'Daily Adaptogen', quantity: -1 },
      { name: 'Signature Mocktail', quantity: -1 }
    ]
  }
]

const DRINKS = [
  {
    name: 'Mineral Water',
    description: 'Premium mineral water selection'
  },
  {
    name: 'Daily Adaptogen',
    description: 'Rotating selection of adaptogenic drinks'
  },
  {
    name: 'Signature Mocktail',
    description: 'Non-alcoholic craft cocktails'
  }
]

async function main() {
  try {
    // Clear existing data
    console.log('Clearing existing packages and drinks...')
    await prisma.packageDrink.deleteMany()
    await prisma.package.deleteMany()
    await prisma.drink.deleteMany()

    // Create drinks
    console.log('Creating drinks...')
    const drinks = await Promise.all(
      DRINKS.map(drink =>
        prisma.drink.create({
          data: {
            name: drink.name,
            description: drink.description
          }
        })
      )
    )

    // Create packages with drinks
    console.log('Creating day passes...')
    for (const pass of PASSES) {
      const package = await prisma.package.create({
        data: {
          type: pass.type,
          name: pass.name,
          description: pass.description,
          memberPrice: pass.memberPrice,
          nonMemberPrice: pass.nonMemberPrice
        }
      })

      // Add drinks to package
      for (const passDrink of pass.drinks) {
        const drink = drinks.find(d => d.name === passDrink.name)
        if (drink) {
          await prisma.packageDrink.create({
            data: {
              packageId: package.id,
              drinkId: drink.id,
              quantity: passDrink.quantity
            }
          })
        }
      }
    }

    // Print summary
    console.log('\nDay Passes Created:')
    const packages = await prisma.package.findMany({
      include: {
        drinks: {
          include: {
            drink: true
          }
        }
      }
    })

    for (const pkg of packages) {
      console.log(`\n${pkg.name}:`)
      console.log(`- Price: ${pkg.memberPrice} AED`)
      console.log('- Drinks:')
      pkg.drinks.forEach(d => {
        console.log(`  • ${d.drink.name}: ${d.quantity === -1 ? 'Unlimited' : d.quantity}`)
      })
    }

  } catch (error) {
    console.error('Error seeding day passes:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)
