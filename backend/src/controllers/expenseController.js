import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// In-memory store for idempotency (use Redis in production)
const requestCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Clean up expired cache entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requestCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
            requestCache.delete(key);
        }
    }
}, 60 * 1000); // Run every minute

/**
 * Generate idempotency key from request data
 */
function generateIdempotencyKey(data) {
    const content = JSON.stringify({
        amount: data.amount,
        category: data.category,
        description: data.description || '',
        date: data.date
    });
    return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Create a new expense
 * POST /api/expenses
 */
export async function createExpense(req, res, next) {
    try {
        const { amount, category, description, date } = req.body;

        // Generate idempotency key
        const idempotencyKey = generateIdempotencyKey(req.body);

        // Check if this request was already processed
        if (requestCache.has(idempotencyKey)) {
            const cached = requestCache.get(idempotencyKey);
            console.log('⚡ Returning cached response for duplicate request');
            return res.status(200).json(cached.response);
        }

        // Create expense in database
        const expense = await prisma.expense.create({
            data: {
                amount: parseFloat(amount),
                category,
                description: description || null,
                date: new Date(date)
            }
        });

        // Format response
        const response = {
            id: expense.id,
            amount: parseFloat(expense.amount),
            category: expense.category,
            description: expense.description,
            date: expense.date.toISOString(),
            createdAt: expense.createdAt.toISOString()
        };

        // Cache the response
        requestCache.set(idempotencyKey, {
            response,
            timestamp: Date.now()
        });

        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}

/**
 * Get all expenses with optional filtering and sorting
 * GET /api/expenses?category=Food&sortBy=date&order=desc
 */
export async function getExpenses(req, res, next) {
    try {
        const { category, sortBy = 'date', order = 'desc' } = req.query;

        // Build where clause
        const where = category ? { category } : {};

        // Build orderBy clause
        const orderBy = {
            [sortBy]: order.toLowerCase() === 'asc' ? 'asc' : 'desc'
        };

        // Fetch expenses
        const expenses = await prisma.expense.findMany({
            where,
            orderBy
        });

        // Format response
        const formattedExpenses = expenses.map(expense => ({
            id: expense.id,
            amount: parseFloat(expense.amount),
            category: expense.category,
            description: expense.description,
            date: expense.date.toISOString(),
            createdAt: expense.createdAt.toISOString()
        }));

        res.json(formattedExpenses);
    } catch (error) {
        next(error);
    }
}

/**
 * Get total expenses with optional category filter
 * GET /api/expenses/total?category=Food
 */
export async function getTotalExpenses(req, res, next) {
    try {
        const { category } = req.query;

        // Build where clause
        const where = category ? { category } : {};

        // Aggregate total
        const result = await prisma.expense.aggregate({
            where,
            _sum: {
                amount: true
            },
            _count: true
        });

        res.json({
            total: parseFloat(result._sum.amount || 0),
            count: result._count,
            category: category || 'all'
        });
    } catch (error) {
        next(error);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
