import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10)

    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@example.com' },
        update: {},
        create: {
            email: 'demo@example.com',
            name: 'Demo User',
            password: hashedPassword,
        },
    })

    console.log('👤 Created demo user:', demoUser.email)

    // Delete existing expenses for demo user to avoid duplicates
    await prisma.expense.deleteMany({
        where: { userId: demoUser.id }
    })

    // Create sample expenses with varied dates and amounts
    const now = new Date()
    const expenses = [
        // Current month expenses
        {
            amount: 45.50,
            category: 'Food',
            description: 'Grocery shopping at Whole Foods',
            date: new Date(now.getFullYear(), now.getMonth(), 15),
            userId: demoUser.id
        },
        {
            amount: 12.99,
            category: 'Food',
            description: 'Coffee and pastry',
            date: new Date(now.getFullYear(), now.getMonth(), 20),
            userId: demoUser.id
        },

        // Last month expenses
        {
            amount: 234.00,
            category: 'Shopping',
            description: 'New winter jacket',
            date: new Date(now.getFullYear(), now.getMonth() - 1, 10),
            userId: demoUser.id
        },
        {
            amount: 89.99,
            category: 'Entertainment',
            description: 'Concert tickets',
            date: new Date(now.getFullYear(), now.getMonth() - 1, 15),
            userId: demoUser.id
        },
        {
            amount: 156.78,
            category: 'Bills',
            description: 'Monthly internet and phone',
            date: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            userId: demoUser.id
        },
        {
            amount: 67.45,
            category: 'Transportation',
            description: 'Gas for car',
            date: new Date(now.getFullYear(), now.getMonth() - 1, 25),
            userId: demoUser.id
        },

        // 2 months ago
        {
            amount: 189.99,
            category: 'Healthcare',
            description: 'Doctor visit and prescription',
            date: new Date(now.getFullYear(), now.getMonth() - 2, 8),
            userId: demoUser.id
        },
        {
            amount: 78.50,
            category: 'Food',
            description: 'Dinner at Italian restaurant',
            date: new Date(now.getFullYear(), now.getMonth() - 2, 14),
            userId: demoUser.id
        },
        {
            amount: 125.00,
            category: 'Shopping',
            description: 'New running shoes',
            date: new Date(now.getFullYear(), now.getMonth() - 2, 20),
            userId: demoUser.id
        },

        // 3 months ago
        {
            amount: 299.99,
            category: 'Entertainment',
            description: 'Gaming console',
            date: new Date(now.getFullYear(), now.getMonth() - 3, 5),
            userId: demoUser.id
        },
        {
            amount: 45.67,
            category: 'Transportation',
            description: 'Uber rides',
            date: new Date(now.getFullYear(), now.getMonth() - 3, 12),
            userId: demoUser.id
        },
        {
            amount: 134.88,
            category: 'Bills',
            description: 'Electricity bill',
            date: new Date(now.getFullYear(), now.getMonth() - 3, 28),
            userId: demoUser.id
        },

        // 4 months ago
        {
            amount: 567.89,
            category: 'Healthcare',
            description: 'Dental cleaning and checkup',
            date: new Date(now.getFullYear(), now.getMonth() - 4, 3),
            userId: demoUser.id
        },
        {
            amount: 89.99,
            category: 'Food',
            description: 'Weekly groceries',
            date: new Date(now.getFullYear(), now.getMonth() - 4, 18),
            userId: demoUser.id
        },

        // 5 months ago
        {
            amount: 1200.00,
            category: 'Other',
            description: 'Laptop repair',
            date: new Date(now.getFullYear(), now.getMonth() - 5, 7),
            userId: demoUser.id
        },
        {
            amount: 76.54,
            category: 'Entertainment',
            description: 'Movie tickets and snacks',
            date: new Date(now.getFullYear(), now.getMonth() - 5, 22),
            userId: demoUser.id
        }
    ]

    // Insert all expenses
    for (const expense of expenses) {
        await prisma.expense.create({
            data: expense
        })
    }

    console.log(`💰 Created ${expenses.length} sample expenses`)
    console.log('✅ Database seeding completed!')

    // Log summary
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    console.log(`📊 Total demo expenses: $${totalAmount.toFixed(2)}`)
    console.log(`📅 Date range: ${expenses.length} expenses over 6 months`)

    const categories = [...new Set(expenses.map(e => e.category))]
    console.log(`🏷️  Categories: ${categories.join(', ')}`)
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })