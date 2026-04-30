import express from 'express';
import { body } from 'express-validator';
import {
    createExpense,
    getExpenses,
    getTotalExpenses
} from '../controllers/expenseController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// Validation rules
const expenseValidation = [
    body('amount')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a positive number'),
    body('category')
        .isIn(['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Other'])
        .withMessage('Invalid category'),
    body('description')
        .optional()
        .isString()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    body('date')
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date')
];

// Routes
router.post('/', expenseValidation, validateRequest, createExpense);
router.get('/', getExpenses);
router.get('/total', getTotalExpenses);

export default router;
