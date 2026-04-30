/**
 * Centralized error handling middleware
 */
export function errorHandler(err, req, res, next) {
    console.error('❌ Error:', err);

    // Prisma errors
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'Conflict',
            message: 'A record with this data already exists'
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Not Found',
            message: 'The requested resource was not found'
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message
        });
    }

    // Default error response
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message;

    res.status(statusCode).json({
        error: err.name || 'Error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}
