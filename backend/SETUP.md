# Backend Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file:**
   Create a `.env` file in the `backend` directory with the following content:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/botcraft_ai?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL="http://localhost:5173"
   ```

3. **Set up PostgreSQL database:**
   - Install PostgreSQL if not already installed
   - Create a database named `botcraft_ai`
   - Update `DATABASE_URL` in `.env` with your credentials

4. **Run Prisma migrations:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## Testing the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Sign Up
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

Save the `token` from the response and use it in subsequent requests:

### Get Current User
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Chatbot
```bash
curl -X POST http://localhost:3001/api/chatbots \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Chatbot",
    "description": "A test chatbot"
  }'
```

## Database Management

- **Prisma Studio** (Database GUI): `npm run prisma:studio`
- **Create migration**: `npm run prisma:migrate`
- **Reset database**: `npx prisma migrate reset`

## Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/          # Express middleware
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Database seed file
├── uploads/                # Uploaded documents
└── package.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET` (at least 32 characters)
3. Build the application: `npm run build`
4. Run migrations: `npm run prisma:migrate`
5. Start server: `npm start`

## Troubleshooting

**Database connection error:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists

**Port already in use:**
- Change `PORT` in `.env`
- Or kill the process using port 3001

**Prisma errors:**
- Run `npm run prisma:generate` after schema changes
- Ensure migrations are up to date: `npm run prisma:migrate`
