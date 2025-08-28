# Development container for Magical Auth Quickstart (React)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install bash, vim, git, and gradle for development
RUN apk add --no-cache bash vim git sudo gradle

# Copy directory structure
COPY . .

# Copy start script and make it executable
RUN chmod +x /app/scripts/dev-env-start.sh

# Install dependencies (including dev dependencies)
RUN npm ci --include=dev
RUN npm install -g typescript

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN adduser nodejs wheel
RUN echo '%wheel ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000 3001

# Use start script as entrypoint
ENTRYPOINT ["/app/scripts/dev-env-start.sh"]
