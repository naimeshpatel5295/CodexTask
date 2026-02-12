# ##############################################################################
# PRODUCTION OPTIMIZED FRONTEND DOCKERFILE
# 
# IMAGE SIZE REDUCTION:
# - Multi-stage build: The heavy Node.js environment (300MB+) is only used 
#   for building and is discarded in the final image.
# - Nginx Alpine: The final runtime is ~5MB, containing only the web server
#   and your static HTML/JS/CSS files.
# - Excludes source code: Only the minified production assets (/dist) are 
#   copied to the final image.
# ##############################################################################

# --- Stage 1: Build Stage (Discarded after build) ---
# Optimization: Alpine minimizes the footprint of the build environment.
FROM node:20-alpine AS builder

# Set the isolated working directory.
WORKDIR /app

# Copy dependency files first to leverage Docker layer caching.
COPY package*.json ./

# Install ALL dependencies (including build tools like Vite).
RUN npm ci

# Copy the source code.
COPY . .

# Run the build process (Vite/React).
# Optimization: This produces a highly compressed/minified 'dist' folder.
RUN npm run build


# --- Stage 2: Production Runtime Stage (The Final Image) ---
# Optimization: Swapping from Node.js to Nginx reduces image size by ~95%.
FROM nginx:alpine AS production

# Copy custom Nginx config (Optimized for SPA and Gzip).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy ONLY the final built assets from the builder stage.
# This prevents source code and 'node_modules' from bloating the image.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port.
EXPOSE 80

# Health check to ensure the web server is actually serving content.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Launch Nginx (daemon off to keep the container running).
CMD ["nginx", "-g", "daemon off;"]
