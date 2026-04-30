import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO, startOfWeek, endOfWeek, eachWeekOfInterval, subWeeks } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function WeeklySpendingChart({ data }) {
    // Generate last 8 weeks data
    const generateWeeklyData = () => {
        const now = new Date()
        const weeks = eachWeekOfInterval({
            start: subWeeks(now, 7),
            end: now
        }, { weekStartsOn: 1 }) // Monday start

        return weeks.map(week => {
            const weekStart = startOfWeek(week, { weekStartsOn: 1 })
            const weekEnd = endOfWeek(week, { weekStartsOn: 1 })

            const weekExpenses = data?.filter(expense => {
                const expenseDate = parseISO(expense.date)
                return expenseDate >= weekStart && expenseDate <= weekEnd
            }) || []

            const total = weekExpenses.reduce((sum, expense) => sum + expense.total, 0)

            return {
                week: format(weekStart, 'MMM dd'),
                total: total,
                count: weekExpenses.length,
                fullDate: weekStart
            }
        })
    }

    const weeklyData = generateWeeklyData()

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
                    <p className="font-semibold text-slate-900 dark:text-white">Week of {label}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
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
                <CardTitle className="text-slate-900 dark:text-white">Weekly Spending</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                    Weekly spending pattern over the last 8 weeks (may be empty if no recent expenses)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis
                            dataKey="week"
                            tick={{ fontSize: 12 }}
                            className="text-slate-600 dark:text-slate-400"
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={formatCurrency}
                            className="text-slate-600 dark:text-slate-400"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', r: 5 }}
                            activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}