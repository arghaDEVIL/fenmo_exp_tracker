import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { api } from '@/lib/api'

export default function TotalCard({ category }) {
    // Use analytics data when showing all categories to ensure consistency
    const { data, isLoading } = useQuery({
        queryKey: category === 'all' ? ['analytics'] : ['total', category],
        queryFn: category === 'all' ? api.getAnalytics : () => api.getTotalExpenses(category),
        staleTime: 0 // Ensure fresh data
    })

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    // Extract the correct values based on data source
    const totalAmount = category === 'all'
        ? data?.summary?.totalExpenses || 0
        : data?.total || 0

    const totalCount = category === 'all'
        ? data?.summary?.totalCount || 0
        : data?.count || 0

    return (
        <Card className="shadow-lg border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-slate-900 dark:text-white">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    Total Spending
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                    {category === 'all' ? 'All categories (All Time)' : category}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <motion.div
                        key={totalAmount}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                        <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {formatCurrency(totalAmount)}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                            {totalCount} {totalCount === 1 ? 'expense' : 'expenses'}
                        </p>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    )
}