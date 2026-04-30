import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { TrendingUp, LogOut, BarChart3, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import { useQueryClient } from '@tanstack/react-query'
import ThemeToggle from '@/components/ThemeToggle'
import ExpenseForm from '@/components/ExpenseForm'
import ExpenseList from '@/components/ExpenseList'
import TotalCard from '@/components/TotalCard'
import FilterBar from '@/components/FilterBar'
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard'

export default function Dashboard() {
    const { user, logout } = useAuth()
    const queryClient = useQueryClient()
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [sortOrder, setSortOrder] = useState('desc')
    const [activeTab, setActiveTab] = useState('expenses') // 'expenses' or 'analytics'

    // Force refresh analytics when switching to analytics tab
    useEffect(() => {
        if (activeTab === 'analytics') {
            queryClient.invalidateQueries({ queryKey: ['analytics'] })
        }
    }, [activeTab, queryClient])

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
            {/* Header */}
            <header className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Expense Tracker
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Welcome, {user?.name || user?.email}
                                </p>
                            </div>
                        </motion.div>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                className="gap-2 text-slate-700 dark:text-slate-300"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
                    </div>

                    {/* Enhanced Tabs */}
                    <div className="flex gap-1 mt-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit mx-auto">
                        <Button
                            variant={activeTab === 'expenses' ? 'default' : 'ghost'}
                            size="lg"
                            onClick={() => setActiveTab('expenses')}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all ${activeTab === 'expenses'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                                }`}
                        >
                            <Receipt className="w-5 h-5 mr-2" />
                            Expenses
                        </Button>
                        <Button
                            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                            size="lg"
                            onClick={() => setActiveTab('analytics')}
                            className={`px-8 py-3 rounded-lg font-semibold transition-all ${activeTab === 'analytics'
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                                }`}
                        >
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Analytics
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {activeTab === 'expenses' ? (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Form and Total */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-1 space-y-6"
                        >
                            <ExpenseForm />
                            <TotalCard category={selectedCategory} />
                        </motion.div>

                        {/* Right Column - Expenses List */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 space-y-6"
                        >
                            <FilterBar
                                selectedCategory={selectedCategory}
                                onCategoryChange={setSelectedCategory}
                                sortOrder={sortOrder}
                                onSortOrderChange={setSortOrder}
                            />
                            <ExpenseList
                                category={selectedCategory}
                                sortOrder={sortOrder}
                            />
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        key="analytics"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <AnalyticsDashboard key={activeTab} />
                    </motion.div>
                )}
            </main>

            <Toaster />
        </div>
    )
}