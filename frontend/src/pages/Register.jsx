import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, User, TrendingUp, Eye, EyeOff, PieChart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import ThemeToggle from '@/components/ThemeToggle'

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    const handleDemoLogin = async () => {
        setLoading(true)
        try {
            const data = await api.login({
                email: 'demo@example.com',
                password: 'demo123'
            })
            login(data.token, data.user)
            toast({
                title: '🎉 Demo Login Successful',
                description: 'Welcome to the demo! Explore with sample data.',
            })
            navigate('/dashboard')
        } catch (error) {
            toast({
                variant: 'destructive',
                title: '❌ Demo Login Failed',
                description: error.message || 'Please try again.',
            })
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast({
                variant: 'destructive',
                title: '❌ Passwords do not match',
                description: 'Please make sure your passwords match'
            })
            return
        }

        if (formData.password.length < 6) {
            toast({
                variant: 'destructive',
                title: '❌ Password too short',
                description: 'Password must be at least 6 characters'
            })
            return
        }

        setLoading(true)

        try {
            const data = await api.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            })
            login(data.token, data.user)
            toast({
                title: '✅ Account created!',
                description: 'Welcome to Expense Tracker'
            })
            navigate('/dashboard')
        } catch (error) {
            toast({
                variant: 'destructive',
                title: '❌ Registration failed',
                description: error.message || 'Could not create account'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 relative">
            {/* Theme Toggle - Top Right */}
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Left Side - Feature Showcase */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-12 items-center justify-center relative overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-lg text-white">
                    <h2 className="text-4xl font-bold mb-6">
                        Start your financial journey today
                    </h2>
                    <p className="text-lg text-emerald-50 mb-8">
                        Join thousands of users who are already managing their finances smarter with our platform.
                    </p>

                    {/* Benefits */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                ✓
                            </div>
                            <span className="text-emerald-50">Free forever, no credit card required</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                ✓
                            </div>
                            <span className="text-emerald-50">Unlimited expense tracking</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                ✓
                            </div>
                            <span className="text-emerald-50">Advanced analytics and insights</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                ✓
                            </div>
                            <span className="text-emerald-50">Bank-level security</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Register Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Expense Tracker
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Smart financial management
                                </p>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Create account
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Get started with your free account
                        </p>
                    </div>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                                Full name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={loading}
                                    className="pl-10 h-11 border-slate-300 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                                Email address *
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled={loading}
                                    className="pl-10 h-11 border-slate-300 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                                Password *
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    disabled={loading}
                                    className="pl-10 pr-10 h-11 border-slate-300 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300">
                                Confirm password *
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    disabled={loading}
                                    className="pl-10 pr-10 h-11 border-slate-300 dark:border-slate-600 focus:border-emerald-500 dark:focus:border-emerald-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/30 mt-6"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating account...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <UserPlus className="h-5 w-5" />
                                    Create account
                                </div>
                            )}
                        </Button>

                        {/* Demo Login Button */}
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-300 dark:border-slate-600" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                                    Or try demo
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handleDemoLogin}
                            variant="outline"
                            className="w-full h-11 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-semibold mt-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                    Connecting...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <PieChart className="h-5 w-5" />
                                    Try Demo (with sample data)
                                </div>
                            )}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
