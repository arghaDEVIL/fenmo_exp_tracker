import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function MonthlyTrendChart({ data }) {
    // Generate last 6 months data
    const generateMonthlyData = () => {
        const now = new Date()
        const months = eachMonthOfInterval({
            start: subMonths(now, 5),
            end: now
        })

        return months.map(month => {
            const monthStart = startOfMonth(month)
            const monthEnd = endOfMonth(month)

            const monthExpenses = data?.filter(expense => {
                const expenseDate = parseISO(expense.date)
                return expenseDate >= monthStart && expenseDate <= monthEnd
            }) || []

            const total = monthExpenses.reduce((sum, expense) => sum + expense.total, 0)

            return {
                month: format(month, 'MMM yyyy'),
                total: total,
                count: monthExpenses.length
            }
        })
    }

    const monthlyData = generateMonthlyData()

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value)
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {payload[0].payload.count} expenses
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <Card className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Monthly Trend</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                    Monthly spending totals over the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 12 }}
                            className="text-slate-600 dark:text-slate-400"
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={formatCurrency}
                            className="text-slate-600 dark:text-slate-400"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTotal)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}