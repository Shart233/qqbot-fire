# ============================================
# qqbot-fire Dockerfile
# Multi-stage build: Gradle build -> JRE runtime
# ============================================

# --- Stage 1: Build ---
FROM eclipse-temurin:24-jdk AS builder

WORKDIR /build

# Copy Gradle wrapper and build files first (for layer caching)
COPY gradlew gradlew
COPY gradle/ gradle/
COPY build.gradle.kts settings.gradle.kts ./

# Make gradlew executable
RUN chmod +x gradlew

# Download dependencies (cached unless build files change)
RUN ./gradlew dependencies --no-daemon || true

# Copy source code
COPY src/ src/

# Build the application
RUN ./gradlew installDist --no-daemon

# --- Stage 2: Runtime ---
FROM eclipse-temurin:24-jre

LABEL maintainer="qqbot-fire"
LABEL description="QQBot-Fire - QQ Bot management platform"

WORKDIR /app

# Copy the built application from builder
COPY --from=builder /build/build/install/qqbot-fire/ ./

# Create directories for runtime data
RUN mkdir -p /app/data

# Expose web console port
EXPOSE 9988

# Volume for persistent data (config, keys, schedules, logs)
VOLUME /app/data

# Entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
