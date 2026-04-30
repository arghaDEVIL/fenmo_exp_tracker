import { Filter, ArrowUpDown, Grid3X3, Utensils, Car, Gamepad2, ShoppingBag, FileText, Heart, Package } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'

const CATEGORY_ICONS = {
    all: Grid3X3,
    Food: Utensils,
    Transportation: Car,
    Entertainment: Gamepad2,
    Shopping: ShoppingBag,
    Bills: FileText,
    Healthcare: Heart,
    Other: Package
}

const CATEGORIES = [
    { value: 'all', label: 'All Categories' },
    { value: 'Food', label: 'Food' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Bills', label: 'Bills' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Other', label: 'Other' }
]

export default function FilterBar({ selectedCategory, onCategoryChange, sortOrder, onSortOrderChange }) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1">
                <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-full sm:w-[200px] bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        {CATEGORIES.map((category) => {
                            const IconComponent = CATEGORY_ICONS[category.value]
                            return (
                                <SelectItem
                                    key={category.value}
                                    value={category.value}
                                    className="text-slate-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer transition-all duration-200 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <IconComponent className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        <span>{category.label}</span>
                                    </div>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onSortOrderChange(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="gap-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
                <ArrowUpDown className="w-4 h-4" />
                {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </Button>
        </div>
    )
}