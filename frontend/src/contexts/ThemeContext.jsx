import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Check if we're in the browser
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme')
            const initialTheme = saved || 'light'

            // Immediately apply theme to prevent flash
            const root = window.document.documentElement
            root.classList.remove('light', 'dark')
            root.classList.add(initialTheme)

            return initialTheme
        }
        return 'light'
    })

    useEffect(() => {
        const root = window.document.documentElement

        // Add transitioning class to disable transitions
        root.classList.add('theme-transitioning')

        // Remove existing theme classes
        root.classList.remove('light', 'dark')

        // Apply new theme class
        root.classList.add(theme)

        // Clear any inline background color set by the preload script
        root.style.backgroundColor = ''

        localStorage.setItem('theme', theme)

        // Re-enable transitions after a brief delay
        const timer = setTimeout(() => {
            root.classList.remove('theme-transitioning')
        }, 50)

        return () => clearTimeout(timer)
    }, [theme])

    function toggleTheme() {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}
