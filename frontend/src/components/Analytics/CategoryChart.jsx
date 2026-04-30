import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = {
    Food: '#f97316',
    Transportation: '#3b82f6',
    Entertainment: '#a855f7',
    Shopping: '#10b981',
    Bills: '#eab308',
    Healthcare: '#ef4444',
    Other: '#6b7280'
}

export default function CategoryChart({ data, summary }) {
    if (!data || data.length === 0) {
        return (
            <Card className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Expenses by Category</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">No data available</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    const chartData = data.map(item => ({
        name: item.category,
        value: item.total,
        percentage: item.percentage
    }))

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value)
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-semibold">{payload[0].name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-xs text-slate-500">
                        {payload[0].payload.percentage}% of total
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <Card className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Expenses by Category</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                    Distribution of all your expenses ({summary?.totalCount || 0} total)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name} ${percentage}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.Other} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {data.map((item) => (
                        <div key={item.category} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[item.category] || COLORS.Other }}
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                {item.category}: {formatCurrency(item.total)}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
