import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const CATEGORY_COLORS = {
    Food: '#10b981',      // emerald-500
    Transportation: '#3b82f6', // blue-500
    Entertainment: '#a855f7',  // purple-500
    Shopping: '#f59e0b',       // amber-500
    Bills: '#ef4444',          // red-500
    Healthcare: '#06b6d4',     // cyan-500
    Other: '#6b7280'           // gray-500
}

export default function ExpenseBreakdown({ data, summary }) {
    console.log('ExpenseBreakdown - data:', data, 'summary:', summary)

    if (!data || data.length === 0) {
        return (
            <Card className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Category Breakdown</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">No data available</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    // Create chart data and find max value for scaling
    const chartData = data
        .filter(item => item.total > 0)
        .map(item => ({
            category: item.category,
            amount: parseFloat(item.total),
            count: item.count,
            color: CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other
        }))
        .sort((a, b) => b.amount - a.amount)

    console.log('ExpenseBreakdown - chartData:', chartData)

    if (chartData.length === 0) {
        return (
            <Card className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Category Breakdown</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">No spending data available</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    const maxAmount = Math.max(...chartData.map(item => item.amount))
    console.log('ExpenseBreakdown - maxAmount:', maxAmount)

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value)
    }

    return (
        <Card className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Category Breakdown</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                    All-time spending by category ({summary?.totalCount || 0} expenses total)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {chartData.map((item) => {
                        const percentage = (item.amount / maxAmount) * 100
                        const barWidth = Math.max(percentage, 8) // Minimum 8% width for visibility

                        console.log(`Bar for ${item.category}: ${percentage}% -> ${barWidth}%`, item)

                        return (
                            <div key={item.category} className="space-y-3">
                                {/* Category Label and Amount */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {item.category}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(item.amount)}
                                    </span>
                                </div>

                                {/* Progress Bar Container */}
                                <div className="relative bg-slate-200 dark:bg-slate-700 rounded-lg h-8 overflow-hidden shadow-inner">
                                    {/* Actual Bar */}
                                    <div
                                        className="h-full rounded-lg flex items-center justify-center px-3 shadow-sm transition-all duration-700 ease-out"
                                        style={{
                                            width: `${barWidth}%`,
                                            backgroundColor: item.color,
                                            minWidth: '80px' // Reduced since we only show one piece of text now
                                        }}
                                    >
                                        <span className="text-xs font-medium text-white drop-shadow-sm whitespace-nowrap">
                                            {item.count} {item.count === 1 ? 'expense' : 'expenses'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Summary Stats */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                {chartData.length}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                Categories
                            </div>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                {formatCurrency(chartData.reduce((sum, item) => sum + item.amount, 0))}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                Total Spent
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}