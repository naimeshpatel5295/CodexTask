# ################################################
# Frontend Dockerfile
# Optimized for high-performance React serving using Nginx
# ################################################

# --- Stage 1: Build the React Application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies (frozen-lockfile equivalent with npm ci)
RUN npm ci

# Copy the entire frontend source code
COPY . .

# Run the build script (Vite/React bundle)
# This creates a minimized /dist folder
RUN npm run build


# --- Stage 2: Serve the Static Files ---
FROM nginx:alpine AS production

# Copy our custom Nginx config (handles SPA routing if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static website files from the builder stage to Nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the standard web port (80)
EXPOSE 80

# Health check to ensure Nginx is serving files
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Launch Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
