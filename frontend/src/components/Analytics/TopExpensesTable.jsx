import { format, parseISO } from 'date-fns'
import { Utensils, Car, Gamepad2, ShoppingBag, FileText, Heart, Package } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const CATEGORY_ICONS = {
    Food: Utensils,
    Transportation: Car,
    Entertainment: Gamepad2,
    Shopping: ShoppingBag,
    Bills: FileText,
    Healthcare: Heart,
    Other: Package
}

export default function TopExpensesTable({ expenses }) {
    if (!expenses || expenses.length === 0) {
        return (
            <Card className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">Top Expenses</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">No expenses found</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    // Sort by amount and take top 10
    const topExpenses = [...expenses]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10)

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    return (
        <Card className="bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Top Expenses</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                    Your highest expenses by amount (all time)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {topExpenses.map((expense, index) => (
                        <div
                            key={expense.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-colors"
                        >
                            {/* Rank */}
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-bold">
                                {index + 1}
                            </div>

                            {/* Category Icon */}
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                {(() => {
                                    const IconComponent = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.Other
                                    return <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                })()}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {expense.category}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {format(parseISO(expense.date), 'MMM dd')}
                                    </span>
                                </div>
                                {expense.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                        {expense.description}
                                    </p>
                                )}
                            </div>

                            {/* Amount */}
                            <div className="text-right">
                                <div className="font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(expense.amount)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}