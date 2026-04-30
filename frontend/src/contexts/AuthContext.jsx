import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in on mount
        if (token) {
            fetchUser()
        } else {
            setLoading(false)
        }
    }, [token])

    async function fetchUser() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const userData = await response.json()
                setUser(userData)
            } else {
                // Token invalid, clear it
                logout()
            }
        } catch (error) {
            console.error('Failed to fetch user:', error)
            logout()
        } finally {
            setLoading(false)
        }
    }

    function login(newToken, userData) {
        localStorage.setItem('token', newToken)
        setToken(newToken)
        setUser(userData)
    }

    function logout() {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
