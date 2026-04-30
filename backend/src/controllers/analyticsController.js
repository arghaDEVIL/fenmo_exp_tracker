import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get analytics dashboard data
 * GET /api/analytics
 */
export async function getAnalytics(req, res, next) {
    try {
        const userId = req.user.userId;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Total expenses (all time)
        const totalExpenses = await prisma.expense.aggregate({
            where: { userId },
            _sum: { amount: true },
            _count: true
        });

        // This month expenses
        const thisMonthExpenses = await prisma.expense.aggregate({
            where: {
                userId,
                date: { gte: startOfMonth }
            },
            _sum: { amount: true },
            _count: true
        });

        // Last month expenses
        const lastMonthExpenses = await prisma.expense.aggregate({
            where: {
                userId,
                date: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth
                }
            },
            _sum: { amount: true }
        });

        // Expenses by category
        const expensesByCategory = await prisma.expense.groupBy({
            by: ['category'],
            where: { userId },
            _sum: { amount: true },
            _count: true,
            orderBy: {
                _sum: {
                    amount: 'desc'
                }
            }
        });

        // Recent expenses (last 7 days)
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentExpenses = await prisma.expense.findMany({
            where: {
                userId,
                date: { gte: sevenDaysAgo }
            },
            orderBy: { date: 'desc' },
            take: 10
        });

        // Daily expenses for last 30 days (for chart)
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyExpenses = await prisma.$queryRaw`
      SELECT 
        DATE(date) as day,
        SUM(amount)::float as total,
        COUNT(*)::int as count
      FROM "Expense"
      WHERE "userId" = ${userId}
        AND date >= ${thirtyDaysAgo}
      GROUP BY DATE(date)
      ORDER BY day ASC
    `;

        // Calculate month-over-month change
        const lastMonthTotal = parseFloat(lastMonthExpenses._sum.amount || 0);
        const thisMonthTotal = parseFloat(thisMonthExpenses._sum.amount || 0);
        const monthOverMonthChange = lastMonthTotal > 0
            ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
            : 0;

        res.json({
            summary: {
                totalExpenses: parseFloat(totalExpenses._sum.amount || 0),
                totalCount: totalExpenses._count,
                thisMonth: parseFloat(thisMonthExpenses._sum.amount || 0),
                thisMonthCount: thisMonthExpenses._count,
                lastMonth: lastMonthTotal,
                monthOverMonthChange: parseFloat(monthOverMonthChange.toFixed(2))
            },
            byCategory: expensesByCategory.map(cat => ({
                category: cat.category,
                total: parseFloat(cat._sum.amount),
                count: cat._count,
                percentage: totalExpenses._sum.amount > 0
                    ? parseFloat(((cat._sum.amount / totalExpenses._sum.amount) * 100).toFixed(2))
                    : 0
            })),
            dailyExpenses: dailyExpenses.map(day => ({
                date: day.day.toISOString().split('T')[0],
                total: parseFloat(day.total),
                count: day.count
            })),
            recentExpenses: recentExpenses.map(expense => ({
                id: expense.id,
                amount: parseFloat(expense.amount),
                category: expense.category,
                description: expense.description,
                date: expense.date.toISOString()
            }))
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
