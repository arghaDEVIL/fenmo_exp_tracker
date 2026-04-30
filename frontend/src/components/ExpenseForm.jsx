import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Loader2, DollarSign, Utensils, Car, Gamepad2, ShoppingBag, FileText, Heart, Package } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'

const CATEGORIES = [
    'Food',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills',
    'Healthcare',
    'Other'
]

const CATEGORY_ICONS = {
    Food: Utensils,
    Transportation: Car,
    Entertainment: Gamepad2,
    Shopping: ShoppingBag,
    Bills: FileText,
    Healthcare: Heart,
    Other: Package
}

export default function ExpenseForm() {
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    })

    const mutation = useMutation({
        mutationFn: api.createExpense,
        onSuccess: () => {
            // Invalidate all related queries to refresh analytics
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
            queryClient.invalidateQueries({ queryKey: ['total'] })
            queryClient.invalidateQueries({ queryKey: ['analytics'] })

            // Force refetch analytics immediately
            queryClient.refetchQueries({ queryKey: ['analytics'] })

            toast({
                title: '✅ Expense added',
                description: 'Your expense has been recorded successfully.',
            })

            // Reset form
            setFormData({
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            })
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                title: '❌ Error',
                description: error.message || 'Failed to add expense. Please try again.',
            })
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.amount || !formData.category || !formData.date) {
            toast({
                variant: 'destructive',
                title: '⚠️ Missing fields',
                description: 'Please fill in all required fields.',
            })
            return
        }

        const amount = parseFloat(formData.amount)
        if (isNaN(amount) || amount <= 0) {
            toast({
                variant: 'destructive',
                title: '⚠️ Invalid amount',
                description: 'Amount must be a positive number.',
            })
            return
        }

        mutation.mutate({
            amount,
            category: formData.category,
            description: formData.description,
            date: new Date(formData.date).toISOString()
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <Card className="shadow-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl text-slate-900 dark:text-white">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-xl font-bold">Add New Expense</div>
                            <div className="text-sm font-normal text-slate-600 dark:text-slate-400">Track your spending</div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Amount - Prominent */}
                        <div className="space-y-3">
                            <Label htmlFor="amount" className="text-base font-semibold text-slate-700 dark:text-slate-300">
                                Amount *
                            </Label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 dark:text-slate-500" />
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    disabled={mutation.isPending}
                                    className="pl-12 h-14 text-2xl font-bold bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Category - Enhanced */}
                        <div className="space-y-3">
                            <Label htmlFor="category" className="text-base font-semibold text-slate-700 dark:text-slate-300">
                                Category *
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
                                disabled={mutation.isPending}
                            >
                                <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                                    {CATEGORIES.map((category) => {
                                        const IconComponent = CATEGORY_ICONS[category]
                                        return (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                                className="text-slate-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer transition-all duration-200 py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                                    <span className="font-medium">{category}</span>
                                                </div>
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <Label htmlFor="description" className="text-base font-semibold text-slate-700 dark:text-slate-300">
                                Description
                            </Label>
                            <Input
                                id="description"
                                type="text"
                                placeholder="What did you spend on?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                disabled={mutation.isPending}
                                maxLength={500}
                                className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-3">
                            <Label htmlFor="date" className="text-base font-semibold text-slate-700 dark:text-slate-300">
                                Date *
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                disabled={mutation.isPending}
                                max={new Date().toISOString().split('T')[0]}
                                className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                            />
                        </div>

                        {/* Submit Button - Prominent */}
                        <Button
                            type="submit"
                            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 dark:shadow-emerald-500/20 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                    Adding Expense...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-3 h-6 w-6" />
                                    Add Expense
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    )
}