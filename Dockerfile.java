# Java 回退镜像；默认 Dockerfile 已切换为 Node 与 NapCat 单容器。
FROM eclipse-temurin:24-jdk AS builder

WORKDIR /build

COPY gradlew gradlew
COPY gradle/ gradle/
COPY build.gradle.kts settings.gradle.kts ./

RUN chmod +x gradlew

RUN ./gradlew dependencies --no-daemon || true

COPY src/ src/

RUN ./gradlew installDist --no-daemon

FROM eclipse-temurin:24-jre

LABEL maintainer="qqbot-fire"
LABEL description="QQBot-Fire - QQ Bot management platform"

ENV FIRE_WEB_HOST=0.0.0.0
WORKDIR /app

COPY --from=builder /build/build/install/qqbot-fire/ ./

RUN mkdir -p /app/data

EXPOSE 9988

VOLUME /app/data

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
