# ################################################
# Backend Dockerfile
# ################################################

# --- Stage 1: Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src/

RUN npm run build


# --- Stage 2: Production Stage ---
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/todos', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start logic (Prompt 8): Run migrations automatically before starting the server
# We use 'migrate deploy' instead of 'migrate dev' because 'deploy' is non-interactive 
# and designed for production/staging environments where you don't want to create new 
# migrations or reset the database unexpectedly.
CMD sh -c "npx prisma migrate deploy && node dist/server.js"
