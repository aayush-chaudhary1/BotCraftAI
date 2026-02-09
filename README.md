# BotCraft AI

Full-stack SaaS for building AI chatbots: React + Vite frontend, Node.js + Express + Prisma + PostgreSQL backend. Includes JWT access + refresh tokens, password reset, and production-ready auth.

## Local dev setup

**Prerequisites:** Node.js 18+, PostgreSQL 14+, npm.

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET (or JWT_SECRET)
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed   # optional: test@example.com / password123 (verified)
npm run dev
```

Backend: `http://localhost:3001`

### Frontend

From repo root:

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`. Vite proxies `/api` and `/health` to the backend.

### Run both

- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `npm run dev` (from root)

## Testing

- **Backend unit tests:** `cd backend && npm test`
- **E2E (Playwright):** Start backend + frontend, then `npx playwright test` (or `npm run test:e2e`). Runs auth page checks (login, signup, forgot password).
- **Frontend build:** `npm run build`
- **CI:** Push to `main` or open a PR; GitHub Actions runs lint, unit tests, and build for backend and frontend.

## Demo: sign up → log in

1. **Register:** Open `http://localhost:5173/signup`, fill email/password/name, submit. You’ll see a success message and can proceed to log in.
2. **Log in:** Open `http://localhost:5173/login`, enter email and password. You get an access token (in memory) and a refresh token (HttpOnly cookie). You’re redirected to the dashboard.
3. **Protected route:** `GET /api/auth/me` with `Authorization: Bearer <access_token>` returns your user. When the access token expires, the frontend can call `POST /api/auth/refresh` (with the cookie) to get a new access token.

## Production

- **Backend:** Set `NODE_ENV=production`, strong JWT secrets, `DATABASE_URL`, and email (SendGrid or SMTP). Run `npx prisma migrate deploy` and `npx prisma generate`, then start the server.
- **Frontend:** Set `VITE_API_URL` to your API origin if different from the app origin. Build with `npm run build` and serve the `dist` folder.
- Use **HTTPS** in production.

## Repo layout

- `/` – React + Vite frontend (Tailwind, Radix, React Router)
- `/backend` – Express API, Prisma, PostgreSQL, auth (register, verify, login, refresh, logout, forgot/reset password)

See `backend/README.md` for API and env details.



Starting and ending today
