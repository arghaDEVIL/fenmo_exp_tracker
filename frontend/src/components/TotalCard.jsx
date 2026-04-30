import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { api } from '@/lib/api'

export default function TotalCard({ category }) {
    const { data, isLoading } = useQuery({
        queryKey: ['total', category],
        queryFn: () => api.getTotalExpenses(category)
    })

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount)
    }

    return (
        <Card className="shadow-lg border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    Total Spending
                </CardTitle>
                <CardDescription>
                    {category === 'all' ? 'All categories' : category}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <motion.div
                        key={data?.total}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {formatCurrency(data?.total || 0)}
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                            {data?.count || 0} {data?.count === 1 ? 'expense' : 'expenses'}
                        </p>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    )
}
