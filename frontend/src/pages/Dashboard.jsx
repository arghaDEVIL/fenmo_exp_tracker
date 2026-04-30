import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Wallet, LogOut, BarChart3, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import ThemeToggle from '@/components/ThemeToggle'
import ExpenseForm from '@/components/ExpenseForm'
import ExpenseList from '@/components/ExpenseList'
import TotalCard from '@/components/TotalCard'
import FilterBar from '@/components/FilterBar'
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard'

export default function Dashboard() {
    const { user, logout } = useAuth()
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [sortOrder, setSortOrder] = useState('desc')
    const [activeTab, setActiveTab] = useState('expenses') // 'expenses' or 'analytics'

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
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
                                className="gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-4">
                        <Button
                            variant={activeTab === 'expenses' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('expenses')}
                            className="gap-2"
                        >
                            <Receipt className="w-4 h-4" />
                            Expenses
                        </Button>
                        <Button
                            variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('analytics')}
                            className="gap-2"
                        >
                            <BarChart3 className="w-4 h-4" />
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
                    <AnalyticsDashboard />
                )}
            </main>

            {/* Footer */}
            <footer className="mt-16 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
                <p>Built with ❤️ using React, Tailwind CSS, and Prisma</p>
            </footer>

            <Toaster />
        </div>
    )
}
