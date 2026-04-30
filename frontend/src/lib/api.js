const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class ApiError extends Error {
    constructor(message, status, details) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.details = details
    }
}

async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new ApiError(
            error.message || 'An error occurred',
            response.status,
            error.details
        )
    }
    return response.json()
}

export const api = {
    async createExpense(data) {
        const response = await fetch(`${API_URL}/api/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        return handleResponse(response)
    },

    async getExpenses(params = {}) {
        const queryParams = new URLSearchParams()
        if (params.category && params.category !== 'all') {
            queryParams.append('category', params.category)
        }
        if (params.sortBy) {
            queryParams.append('sortBy', params.sortBy)
        }
        if (params.order) {
            queryParams.append('order', params.order)
        }

        const url = `${API_URL}/api/expenses${queryParams.toString() ? `?${queryParams}` : ''}`
        const response = await fetch(url)
        return handleResponse(response)
    },

    async getTotalExpenses(category) {
        const queryParams = new URLSearchParams()
        if (category && category !== 'all') {
            queryParams.append('category', category)
        }

        const url = `${API_URL}/api/expenses/total${queryParams.toString() ? `?${queryParams}` : ''}`
        const response = await fetch(url)
        return handleResponse(response)
    },
}
