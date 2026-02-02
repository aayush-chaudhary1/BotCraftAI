# BotCraft AI Backend

Production-ready backend API for BotCraft AI: Node.js, TypeScript, Express, PostgreSQL, Prisma. Includes JWT access + refresh tokens, password reset, rate limiting, and helmet.

## Local dev setup

**Prerequisites:** Node.js 18+, PostgreSQL 14+, npm.

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`: set `DATABASE_URL`, `JWT_ACCESS_TOKEN_SECRET`, `JWT_REFRESH_TOKEN_SECRET` (or `JWT_SECRET` for both). Optionally set `EMAIL_*` for real emails.

3. **Database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
   Use a local dev DB for migrations. When prompted, name the migration (e.g. `init` or `add_auth_email_refresh`).

4. **Seed (optional)**
   ```bash
   npm run prisma:seed
   ```
   Creates test user `test@example.com` / `password123` (verified, so you can log in).

5. **Run backend**
   ```bash
   npm run dev
   ```
   API: `http://localhost:3001`

**Run frontend (from repo root):**
   ```bash
   npm install
   npm run dev
   ```
   App: `http://localhost:5173`. Vite proxies `/api` and `/health` to the backend.

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | `3001` |
| `JWT_ACCESS_TOKEN_SECRET` | Access JWT secret | Required (or `JWT_SECRET`) |
| `JWT_REFRESH_TOKEN_SECRET` | Refresh JWT secret | Required (or `JWT_SECRET`) |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `FRONTEND_URL` | CORS / redirect origin | `http://localhost:5173` |
| `EMAIL_PROVIDER` | `sendgrid` or `smtp` | `smtp` |
| `EMAIL_API_KEY` | SendGrid API key | - |
| `EMAIL_FROM` | From address | `noreply@localhost` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | SMTP fallback | - |

## Auth API (brief)

| Method | Path | Body / Query | Description |
|--------|------|--------------|-------------|
| POST | `/api/auth/register` | `{ email, password, name? }` | Register; user can log in immediately |
| GET | `/api/auth/verify-email` | `?token=` | Legacy endpoint (verification not required) |
| POST | `/api/auth/login` | `{ email, password }` | Login; returns access token + sets refresh cookie |
| POST | `/api/auth/refresh` | (cookie) | Rotate refresh token; returns new access token |
| POST | `/api/auth/logout` | (cookie) | Invalidate refresh token; clear cookie |
| POST | `/api/auth/forgot-password` | `{ email }` | Send password reset email |
| POST | `/api/auth/reset-password` | `{ token, password }` | Reset password; invalidate refresh tokens |
| GET | `/api/auth/me` | Bearer token | Current user (requires auth) |

Responses: `{ success: true, data?, message? }` or `{ success: false, error }`.

## Migrations

- **Dev:** `npm run prisma:migrate` (creates/updates migration and applies it).
- **Prod:** `npx prisma migrate deploy` then `npx prisma generate`. Run only when env secrets (e.g. `DATABASE_URL`) are set.

## Tests

```bash
npm test
```
Runs Jest unit tests (e.g. auth service). No DB required when using mocks.

## Production

- Use HTTPS; set `NODE_ENV=production`.
- Use strong, distinct `JWT_ACCESS_TOKEN_SECRET` and `JWT_REFRESH_TOKEN_SECRET`.
- Configure SendGrid or SMTP for password reset emails (and verification emails if you re-enable verification later).
- Run `npx prisma migrate deploy` before starting the app.

## Other endpoints

- Chatbots: CRUD under `/api/chatbots`
- Documents: upload/list under `/api/chatbots/:id/documents`
- Chat: `/api/chatbots/:id/chat`, sessions under `/api/chatbots/:id/sessions`
- Settings: `/api/settings`

See code and ARCHITECTURE.md for details.
