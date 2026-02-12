# Codex - Docker Deployment Guide

## 📦 Docker Architecture

This project uses **separate Dockerfiles** for frontend and backend:

### Why Separate Dockerfiles?

1. **Different Build Processes**
   - **Backend**: Simple Node.js server (copy files → install deps → run)
   - **Frontend**: Multi-stage build (install deps → build with Vite → serve with nginx)

2. **Different Runtime Requirements**
   - **Backend**: Node.js runtime
   - **Frontend**: Nginx web server for static files

3. **Independent Scaling**: Deploy and scale services independently

---

## 🏗️ Project Structure

```
Codex-project/
├── backend/
│   ├── Dockerfile          ← Backend container definition
│   ├── .dockerignore       ← Exclude node_modules, etc.
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── Dockerfile          ← Frontend multi-stage build
│   ├── nginx.conf          ← Nginx configuration
│   ├── .dockerignore
│   └── src/
├── docker-compose.yml      ← Orchestrates both services
└── README-Docker.md        ← This file
```

---

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start both services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access the application:**

- Frontend: http://localhost
- Backend API: http://localhost:5000

---

### Option 2: Build and Run Individually

#### Backend

```bash
# Navigate to backend directory
cd backend

# Build the image
docker build -t codex-backend .

# Run the container
docker run -d -p 5000:5000 --name codex-backend codex-backend
```

#### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Build the image
docker build -t codex-frontend .

# Run the container
docker run -d -p 80:80 --name codex-frontend codex-frontend
```

---

## 🔍 Docker Images Explained

### Backend Dockerfile

- **Base Image**: `node:20-alpine` (lightweight)
- **Process**: Install production dependencies → Copy server code → Run
- **Port**: 5000
- **Health Check**: Pings `/todos` endpoint

### Frontend Dockerfile (Multi-stage)

- **Stage 1 (Builder)**:
  - Base: `node:20-alpine`
  - Install all dependencies → Build with Vite → Create `dist/` folder
- **Stage 2 (Production)**:
  - Base: `nginx:alpine`
  - Copy built files from Stage 1 → Serve with nginx
  - Port: 80
  - Health Check: Pings root URL

---

## 🛠️ Useful Commands

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View logs for a specific service
docker-compose logs backend
docker-compose logs frontend

# Rebuild a specific service
docker-compose up --build backend

# Remove all containers and networks
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Execute commands inside a running container
docker exec -it codex-backend sh
docker exec -it codex-frontend sh

# View resource usage
docker stats
```

---

## 🔧 Customization

### Change Ports

Edit `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8080:5000" # Host:Container
  frontend:
    ports:
      - "3000:80"
```

### Environment Variables

Create a `.env` file in the root directory:

```env
BACKEND_PORT=5000
NODE_ENV=production
VITE_API_URL=http://localhost:5000
```

Update `docker-compose.yml` to use it:

```yaml
services:
  backend:
    env_file:
      - .env
```

---

## 📊 Health Checks

Both services include health checks:

- **Backend**: Checks if `/todos` endpoint responds with 200
- **Frontend**: Checks if nginx is serving the root page

View health status:

```bash
docker ps
# Look for "healthy" in the STATUS column
```

---

## 🐛 Troubleshooting

### Frontend can't connect to backend

**Problem**: CORS errors or connection refused

**Solution**: Update frontend API URL

1. Check `src/App.jsx` - ensure API URL points to `http://localhost:5000`
2. For production, use environment variables

### Container won't start

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Port already in use

```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change the port in docker-compose.yml
```

---

## 📦 Production Deployment

### Build for Production

```bash
# Build optimized images
docker-compose build

# Tag images for registry
docker tag codex-backend:latest your-registry/codex-backend:v1.0.0
docker tag codex-frontend:latest your-registry/codex-frontend:v1.0.0

# Push to registry
docker push your-registry/codex-backend:v1.0.0
docker push your-registry/codex-frontend:v1.0.0
```

### Best Practices

1. **Use specific versions** instead of `latest`
2. **Set resource limits** in docker-compose.yml
3. **Use secrets** for sensitive data (not environment variables)
4. **Enable logging** to external service
5. **Set up monitoring** (Prometheus, Grafana)

---

## 🎯 Next Steps

- [ ] Add database service (PostgreSQL/MongoDB) to docker-compose
- [ ] Implement volume mounts for persistent data
- [ ] Set up nginx reverse proxy for both services
- [ ] Add SSL/TLS certificates
- [ ] Configure CI/CD pipeline for automated builds
- [ ] Set up container orchestration (Kubernetes)

---

## 📚 Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
