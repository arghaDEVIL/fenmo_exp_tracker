# Expense Tracker Backend

Production-ready Express API with Prisma ORM and PostgreSQL.

## Features

- ✅ RESTful API design
- ✅ Idempotency handling (prevents duplicate submissions)
- ✅ Input validation with express-validator
- ✅ Centralized error handling
- ✅ CORS configuration
- ✅ Security headers with Helmet
- ✅ Prisma ORM for type-safe database access
- ✅ PostgreSQL with proper decimal handling

## API Endpoints

### Create Expense
```http
POST /api/expenses
Content-Type: application/json

{
  "amount": 49.99,
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2026-05-01T10:00:00Z"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "amount": 49.99,
  "category": "Food",
  "description": "Grocery shopping",
  "date": "2026-05-01T10:00:00.000Z",
  "createdAt": "2026-05-01T10:00:00.000Z"
}
```

### Get Expenses
```http
GET /api/expenses?category=Food&sortBy=date&order=desc
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "amount": 49.99,
    "category": "Food",
    "description": "Grocery shopping",
    "date": "2026-05-01T10:00:00.000Z",
    "createdAt": "2026-05-01T10:00:00.000Z"
  }
]
```

### Get Total
```http
GET /api/expenses/total?category=Food
```

**Response:** `200 OK`
```json
{
  "total": 149.97,
  "count": 3,
  "category": "Food"
}
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/expense_tracker"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

3. Run migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Start server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Production Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for complete instructions.

## Architecture Decisions

### Idempotency
Uses content-based hashing to detect duplicate requests within a 5-minute window. This prevents:
- Accidental double-clicks
- Network retries
- Page refresh after submission

**Trade-off:** In-memory cache doesn't survive restarts. For production at scale, use Redis.

### Money Handling
- Stores amounts as `Decimal(10,2)` in PostgreSQL
- Avoids JavaScript floating-point errors
- Always rounds to 2 decimal places

### Error Handling
- Centralized error middleware
- Proper HTTP status codes
- Detailed errors in development
- Generic errors in production

## Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## License

MIT
