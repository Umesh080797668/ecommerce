# ShopVerse Enterprise - Multi-stage Docker build
FROM node:18-alpine AS frontend-builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build optimized frontend assets
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache \
    bash \
    curl \
    && rm -rf /var/cache/apk/*

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
COPY --from=frontend-builder /app/js /usr/share/nginx/html/js
COPY --from=frontend-builder /app/styles /usr/share/nginx/html/styles
COPY --from=frontend-builder /app/assets /usr/share/nginx/html/assets
COPY --from=frontend-builder /app/pages /usr/share/nginx/html/pages
COPY --from=frontend-builder /app/admin /usr/share/nginx/html/admin
COPY --from=frontend-builder /app/sellers /usr/share/nginx/html/sellers
COPY --from=frontend-builder /app/mobile /usr/share/nginx/html/mobile
COPY --from=frontend-builder /app/api /usr/share/nginx/html/api
COPY --from=frontend-builder /app/*.html /usr/share/nginx/html/

# Add non-root user
RUN addgroup -g 1001 -S shopverse && \
    adduser -S shopverse -u 1001

# Set proper permissions
RUN chown -R shopverse:shopverse /usr/share/nginx/html && \
    chown -R shopverse:shopverse /var/cache/nginx && \
    chown -R shopverse:shopverse /var/log/nginx && \
    chown -R shopverse:shopverse /etc/nginx/conf.d

# Create directories nginx needs
RUN touch /var/run/nginx.pid && \
    chown -R shopverse:shopverse /var/run/nginx.pid

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Switch to non-root user
USER shopverse

# Expose port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]