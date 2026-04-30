import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, Calendar, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CategoryChart from './CategoryChart'
import TrendChart from './TrendChart'

function StatsCard({ title, value, count, change, icon: Icon }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(value)}</div>
                {count !== undefined && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {count} {count === 1 ? 'expense' : 'expenses'}
                    </p>
                )}
                {change !== undefined && change !== 0 && (
                    <div className={`flex items-center gap-1 text-xs mt-2 ${change > 0 ? 'text-red-600' : 'text-green-600'}`}>
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
    const { data, isLoading } = useQuery({
        queryKey: ['analytics'],
        queryFn: api.getAnalytics
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
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
        <div className="space-y-6">
            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <StatsCard
                    title="Total Expenses"
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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <CategoryChart data={data.byCategory} />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <TrendChart data={data.dailyExpenses} />
                </motion.div>
            </div>
        </div>
    )
}
