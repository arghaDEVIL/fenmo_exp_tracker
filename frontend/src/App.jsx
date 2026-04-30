import { useState } from 'react'
import { motion } from 'framer-motion'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import TotalCard from './components/TotalCard'
import FilterBar from './components/FilterBar'
import { Toaster } from './components/ui/toaster'
import { Wallet } from 'lucide-react'

function App() {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [sortOrder, setSortOrder] = useState('desc')

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Expense Tracker
                            </h1>
                            <p className="text-sm text-slate-600">Manage your finances with ease</p>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
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
            </main>

            {/* Footer */}
            <footer className="mt-16 py-6 text-center text-sm text-slate-600">
                <p>Built with ❤️ using React, Tailwind CSS, and Prisma</p>
            </footer>

            <Toaster />
        </div>
    )
}

export default App
