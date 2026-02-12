# Running BotCraft AI in VS Code

This guide will help you set up and run the BotCraft AI project using Visual Studio Code.

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Version 18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (Version 14 or higher)
- [Visual Studio Code](https://code.visualstudio.com/)

## 1. Database Setup

1. Make sure your PostgreSQL server is running.
2. Create a database named `botcraft_ai` (or whatever matches your `.env` file).

## 2. Backend Setup

1. Open the project in VS Code.
2. Open a terminal (`Ctrl+` `)`.
3. Navigate to the backend directory:
   ```powershell
   cd backend
   ```
4. Install dependencies (if you haven't already):
   ```powershell
   npm install
   ```
5. Set up environment variables:
   - Make sure you hav a `.env` file in the `backend` folder.
   - Ensure `DATABASE_URL` is correct.
6. Generate Prisma Client (Critical Step):
   ```powershell
   npm run prisma:generate
   ```
7. Migrate Database:
   ```powershell
   npm run prisma:migrate
   ```

## 3. Frontend Setup

1. Open a **new** terminal (click the `+` icon in the terminal panel).
2. Ensure you are in the root directory (or `cd ..` if taking from backend).
3. Install dependencies:
   ```powershell
   npm install
   ```

## 4. Running the Application

You need to run both the backend and frontend simultaneously. VS Code's Split Terminal feature is perfect for this.

### Step 1: Start Backend
In your **backend terminal**:
```powershell
npm run dev
```
Wait until you see "Server running on port 3001" (or similar).

### Step 2: Start Frontend
In your **frontend terminal**:
```powershell
npm run dev
```
You should see "Local: http://localhost:5173".

### Step 3: Access the App
Open your browser runs go to `http://localhost:5173`.

## Troubleshooting

### "Prisma Client not found"
If you see an error about `@prisma/client` or `PrismaClient` not being found:
- Stop the backend server (`Ctrl+C`).
- Run `npm run prisma:generate` in the backend folder.
- Restart the server.

### "MODULE_NOT_FOUND" for Prisma
- Ensure your `node_modules` are not corrupted.
- Delete `node_modules` and `package-lock.json`, then run `npm install`.
