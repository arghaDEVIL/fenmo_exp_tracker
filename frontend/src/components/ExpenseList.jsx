import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Receipt, Loader2, Inbox } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { api } from '@/lib/api'

const CATEGORY_COLORS = {
    Food: 'from-orange-500 to-red-500',
    Transportation: 'from-blue-500 to-cyan-500',
    Entertainment: 'from-purple-500 to-pink-500',
    Shopping: 'from-green-500 to-emerald-500',
    Bills: 'from-yellow-500 to-orange-500',
    Healthcare: 'from-red-500 to-rose-500',
    Other: 'from-gray-500 to-slate-500'
}

const CATEGORY_ICONS = {
    Food: '🍔',
    Transportation: '🚗',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Bills: '📄',
    Healthcare: '⚕️',
    Other: '📦'
}

function ExpenseSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-200 rounded w-1/4" />
                                <div className="h-3 bg-slate-200 rounded w-1/2" />
                            </div>
                            <div className="h-6 bg-slate-200 rounded w-20" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
        >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                <Inbox className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No expenses yet</h3>
            <p className="text-slate-600">Start tracking by adding your first expense</p>
        </motion.div>
    )
}

export default function ExpenseList({ category, sortOrder }) {
    const { data: expenses, isLoading } = useQuery({
        queryKey: ['expenses', category, sortOrder],
        queryFn: () => api.getExpenses({
            category: category === 'all' ? undefined : category,
            sortBy: 'date',
            order: sortOrder
        })
    })

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    if (isLoading) {
        return <ExpenseSkeleton />
    }

    if (!expenses || expenses.length === 0) {
        return <EmptyState />
    }

    return (
        <div className="space-y-4">
            <AnimatePresence mode="popLayout">
                {expenses.map((expense, index) => (
                    <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                    >
                        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    {/* Category Icon */}
                                    <div className={`w-12 h-12 bg-gradient-to-br ${CATEGORY_COLORS[expense.category]} rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                                        {CATEGORY_ICONS[expense.category]}
                                    </div>

                                    {/* Expense Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-slate-900">
                                                {expense.category}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {format(new Date(expense.date), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                        {expense.description && (
                                            <p className="text-sm text-slate-600 truncate">
                                                {expense.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Amount */}
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-slate-900">
                                            {formatCurrency(expense.amount)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
