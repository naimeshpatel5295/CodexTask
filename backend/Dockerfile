# ##############################################################################
# PRODUCTION OPTIMIZED BACKEND DOCKERFILE
# 
# IMAGE SIZE REDUCTION:
# - Uses 'alpine' base: ~5MB base instead of ~300MB (Debian).
# - Multi-stage build: Prevents bulky build tools (TypeScript, Compilers) from 
#   bloating the final image. Only raw JS and required dependencies are included.
# - --omit=dev: Removes hundreds of MBs of development tools like 'typescript', 
#   'ts-node', and '@types' packages.
#
# RAM OPTIMIZATION:
# - 'tini': Smallest init process (prevents zombie processes and handles OS signals).
# - Minimal Dependencies: Fewer files for Node.js to index and load into memory.
# ##############################################################################

# --- Stage 1: Build & Source Preparation ---
# Sets up the environment to compile TypeScript code.
FROM node:20-alpine AS builder

# Set the working directory (isolated from host OS).
WORKDIR /app

# Copy dependency manifests first (optimizes Docker caching Layers).
COPY package*.json ./
# Copy prisma folder (required for client generation).
COPY prisma ./prisma/

# Install ALL dependencies (including TypeScript and Build Tools).
RUN npm ci

# Generate the Prisma Client (creates the ORM code for our schema).
RUN npx prisma generate

# Copy the rest of the source code.
COPY tsconfig.json ./
COPY src ./src/

# Compile TypeScript into standard JavaScript (output goes to ./dist).
RUN npm run build


# --- Stage 2: Final Production Runtime ---
# This is the ONLY part that becomes the final image.
FROM node:20-alpine AS production

# Add 'tini' via alpine package manager (improves process management and RAM stability).
RUN apk add --no-cache tini

# Set environment to production (Node.js and frameworks use this to optimize performance).
ENV NODE_ENV=production

# Set working directory.
WORKDIR /app

# Copy package manifests (required for the runtime).
COPY package*.json ./
# Copy prisma schema (required for 'migrate deploy' on startup).
COPY prisma ./prisma/

# Install ONLY production-ready dependencies (--omit=dev).
# This excludes compiler tools and types, cutting image size by 60-80%.
RUN npm ci --omit=dev

# Copy the pre-compiled JavaScript from the 'builder' stage.
# We don't need the TypeScript source here, only the runnable JS.
COPY --from=builder /app/dist ./dist

# Copy the generated Prisma client from the 'builder' stage (saves time and binary space).
# Prisma client includes the binary engine for communicating with PostgreSQL.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Use Tini as the entry point (handles signals like SIGTERM properly).
ENTRYPOINT ["/sbin/tini", "--"]

# Expose the API port.
EXPOSE 5000

# Health Check: Monitors if the service is actually working internally.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/todos', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Execute: Apply DB migrations AND then start the server.
# Using 'migrate deploy' is safe for production/automated environments.
CMD sh -c "npx prisma migrate deploy && node dist/server.js"
