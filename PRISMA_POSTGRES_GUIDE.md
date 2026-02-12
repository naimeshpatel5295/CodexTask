# Codex Project: PostgreSQL & Prisma Migration Guide

This document provides a comprehensive overview of how we refactored the Codex backend from an in-memory array to a persistent PostgreSQL database using Prisma ORM.

---

## 🎯 Project Objective

Replace the volatile in-memory `todos` array with a production-grade database to ensure task persistence across server restarts and container rebuilds.

---

## 🛠️ Step 1: Infrastructure Setup (Docker Compose)

We added a dedicated PostgreSQL service to our `docker-compose.yml` file.

### Key Configuration:

- **Image**: `postgres:15-alpine` (lightweight and stable).
- **Environment Variables**: Defined `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`.
- **Persistence**: Added a Docker volume (`postgres_data`) mapped to `/var/lib/postgresql/data` so data isn't lost when the container stops.
- **Health Checks**: Used `pg_isready` to ensure the database is fully booted before the backend attempts to connect.

---

## 💎 Step 2: Prisma ORM Integration

Prisma acts as the bridge between our TypeScript code and the SQL database.

### 1. Installation

We installed the core dependencies:

```bash
npm install prisma --save-dev
npm install @prisma/client
```

### 2. Schema Definition (`backend/prisma/schema.prisma`)

We defined our data structure in the Prisma schema:

- **Datasource**: Configured to use the `postgresql` provider and pull the URL from an environment variable.
- **Model**: Created a `Todo` model with fields for `id` (UUID), `text`, `completed` (boolean), and `createdAt` (timestamp).

---

## 🚀 Step 3: Database Migrations

Migrations are used to "version control" your database schema.

- **Development**: We used `npx prisma migrate dev --name init` to generate the SQL files and update the local database.
- **Production (Docker)**: We use `npx prisma migrate deploy`. This applies existing migrations to the database without needing user interaction or resetting data.

---

## 🏗️ Step 4: Backend Refactoring (TypeScript)

We migrated the backend to TypeScript to leverage Prisma's auto-generated types and improve code reliability.

### 1. Prisma Singleton (`src/lib/prisma.ts`)

To prevent "Too many connections" errors during development reloads, we implemented a singleton pattern. This ensures only one instance of `PrismaClient` is active at any time.

### 2. Database Connection Test

Modified `server.ts` to test the connection on startup:

```typescript
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    app.listen(PORT, () => ...);
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
}
```

### 3. API Route Updates

Updated all Express routes to use `async/await` and Prisma methods:

- `prisma.todo.findMany()` -> Fetch all
- `prisma.todo.create()` -> Add new
- `prisma.todo.update()` -> Toggle status
- `prisma.todo.delete()` -> Remove

---

## 🐳 Step 5: Dockerization & Orchestration

The Backend `Dockerfile` was updated to a **multi-stage build**:

1.  **Stage 1 (Builder)**: Installs devDependencies, generates the Prisma client, and compiles TypeScript into JavaScript.
2.  **Stage 2 (Production)**: Copies only the compiled JS and production dependencies for a slim, secure image.

### Automatic Migrations:

The container startup command was changed to:
`npx prisma migrate deploy && node dist/server.js`
This ensures the database tables are created automatically before the server starts.

---

## 📑 Useful Commands Cheat Sheet

| Task                 | Command                                      |
| :------------------- | :------------------------------------------- |
| **Start everything** | `docker compose up --build -d`               |
| **View database UI** | `npx prisma studio` (inside /backend)        |
| **Check logs**       | `docker compose logs -f backend`             |
| **Create migration** | `npx prisma migrate dev --name rename_field` |
| **Reset DB**         | `npx prisma migrate reset`                   |

---

## ✅ Final State

- **Frontend**: React app on [http://localhost](http://localhost)
- **Backend**: TypeScript API on [http://localhost:5000](http://localhost:5000)
- **Database**: PostgreSQL on port `5432`
