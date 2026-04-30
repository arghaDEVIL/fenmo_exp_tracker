import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Calendar, Loader2, RefreshCw } from 'lucide-react'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CategoryChart from './CategoryChart'
import TrendChart from './TrendChart'
import ExpenseBreakdown from './ExpenseBreakdown'
import WeeklySpendingChart from './WeeklySpendingChart'
import MonthlyTrendChart from './MonthlyTrendChart'
import TopExpensesTable from './TopExpensesTable'
import SpendingInsights from './SpendingInsights'

function StatsCard({ title, value, count, change, icon: Icon }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    return (
        <Card className="shadow-sm bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">{title}</CardTitle>
                {Icon && <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(value)}</div>
                {count !== undefined && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {count} {count === 1 ? 'expense' : 'expenses'}
                    </p>
                )}
                {change !== undefined && change !== 0 && (
                    <div className={`flex items-center gap-1 text-xs mt-2 ${change > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                        {change > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{Math.abs(change).toFixed(1)}% from last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function AnalyticsDashboard() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['analytics'],
        queryFn: api.getAnalytics,
        staleTime: 0, // Always refetch to ensure fresh data
        cacheTime: 0, // Don't cache the data
        refetchOnWindowFocus: true,
        refetchInterval: false, // Don't auto-refetch on interval
        refetchOnMount: true, // Always refetch when component mounts
        retry: 3,
        retryDelay: 1000
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">Loading analytics...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400 mb-4">Failed to load analytics</p>
                <Button onClick={() => refetch()} variant="outline">
                    Try Again
                </Button>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">No analytics data available</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header with Refresh Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h2>
                    <p className="text-slate-600 dark:text-slate-400">Comprehensive view of your spending patterns</p>
                </div>
                <Button
                    onClick={() => refetch()}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={isLoading}
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Info Message if no current month data */}
            {data.summary.thisMonth === 0 && data.summary.totalExpenses > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                                No expenses this month
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                Your analytics show historical data. Add some expenses this month to see current trends!
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Main Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <StatsCard
                    title="Total Expenses (All Time)"
                    value={data.summary.totalExpenses}
                    count={data.summary.totalCount}
                    icon={DollarSign}
                />
                <StatsCard
                    title="This Month"
                    value={data.summary.thisMonth}
                    count={data.summary.thisMonthCount}
                    change={data.summary.monthOverMonthChange}
                    icon={Calendar}
                />
                <StatsCard
                    title="Last Month"
                    value={data.summary.lastMonth}
                    icon={TrendingUp}
                />
            </motion.div>

            {/* Spending Insights */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <SpendingInsights
                    summary={data.summary}
                    categoryData={data.byCategory}
                    dailyData={data.dailyExpenses}
                />
            </motion.div>

            {/* Monthly Trend - Full Width */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <MonthlyTrendChart data={data.dailyExpenses} />
            </motion.div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <CategoryChart data={data.byCategory} summary={data.summary} />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <ExpenseBreakdown data={data.byCategory} summary={data.summary} />
                </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <WeeklySpendingChart data={data.dailyExpenses} />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <TrendChart data={data.dailyExpenses} />
                </motion.div>
            </div>

            {/* Top Expenses Table - Full Width */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <TopExpensesTable expenses={data.topExpenses} />
            </motion.div>
        </div>
    )
}