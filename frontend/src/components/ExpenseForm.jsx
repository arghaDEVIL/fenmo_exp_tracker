import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Loader2 } from 'lucide-react'
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
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
            queryClient.invalidateQueries({ queryKey: ['total'] })

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
        <Card className="shadow-lg border-slate-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                        <Plus className="w-5 h-5 text-white" />
                    </div>
                    Add Expense
                </CardTitle>
                <CardDescription>Record a new expense</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount *</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            disabled={mutation.isPending}
                            className="text-lg font-semibold"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                            disabled={mutation.isPending}
                        >
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            type="text"
                            placeholder="What did you spend on?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={mutation.isPending}
                            maxLength={500}
                        />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            disabled={mutation.isPending}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Expense
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
