import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SpendingInsights({ summary, categoryData, dailyData }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    // Calculate insights
    // Daily Average: Use total expenses divided by days since first expense
    const calculateDailyAverage = () => {
        if (!dailyData || dailyData.length === 0 || summary.totalExpenses === 0) {
            return 0
        }

        // Find the date range from first expense to now
        const sortedDates = dailyData.map(d => new Date(d.date)).sort((a, b) => a - b)
        const firstExpenseDate = sortedDates[0]
        const now = new Date()
        const daysSinceFirst = Math.max(1, Math.ceil((now - firstExpenseDate) / (1000 * 60 * 60 * 24)))

        return summary.totalExpenses / daysSinceFirst
    }

    const avgDailySpending = calculateDailyAverage()
    const topCategory = categoryData?.[0]
    const monthlyChange = summary.monthOverMonthChange

    // Calculate spending velocity (last 7 days vs previous 7 days)
    const calculateWeeklyVelocity = () => {
        if (!dailyData || dailyData.length === 0) return 0

        const now = new Date()
        const last7DaysStart = new Date(now)
        last7DaysStart.setDate(last7DaysStart.getDate() - 7)

        const prev7DaysStart = new Date(now)
        prev7DaysStart.setDate(prev7DaysStart.getDate() - 14)
        const prev7DaysEnd = new Date(now)
        prev7DaysEnd.setDate(prev7DaysEnd.getDate() - 7)

        const last7Total = dailyData
            .filter(day => {
                const dayDate = new Date(day.date)
                return dayDate >= last7DaysStart && dayDate <= now
            })
            .reduce((sum, day) => sum + day.total, 0)

        const prev7Total = dailyData
            .filter(day => {
                const dayDate = new Date(day.date)
                return dayDate >= prev7DaysStart && dayDate < prev7DaysEnd
            })
            .reduce((sum, day) => sum + day.total, 0)

        return prev7Total > 0 ? ((last7Total - prev7Total) / prev7Total) * 100 : 0
    }

    const weeklyChange = calculateWeeklyVelocity()

    const insights = [
        {
            title: 'Daily Average',
            value: formatCurrency(avgDailySpending),
            description: summary.totalExpenses > 0 ? 'Average spending per day since first expense' : 'No expenses yet',
            icon: Target,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20'
        },
        {
            title: 'Top Category',
            value: topCategory?.category || 'None',
            description: `${topCategory?.percentage || 0}% of total spending`,
            icon: TrendingUp,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/20'
        },
        {
            title: 'Monthly Trend',
            value: `${monthlyChange > 0 ? '+' : ''}${monthlyChange.toFixed(1)}%`,
            description: 'Change from last month',
            icon: monthlyChange > 0 ? TrendingUp : TrendingDown,
            color: monthlyChange > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400',
            bgColor: monthlyChange > 0 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'
        },
        {
            title: 'Weekly Velocity',
            value: `${weeklyChange > 0 ? '+' : ''}${weeklyChange.toFixed(1)}%`,
            description: 'Last 7 days vs previous 7 days',
            icon: weeklyChange > 0 ? AlertCircle : TrendingDown,
            color: weeklyChange > 10 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400',
            bgColor: weeklyChange > 10 ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-slate-100 dark:bg-slate-800'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((insight, index) => (
                <Card key={index} className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${insight.bgColor}`}>
                                <insight.icon className={`w-6 h-6 ${insight.color}`} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {insight.title}
                                </p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {insight.value}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {insight.description}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}