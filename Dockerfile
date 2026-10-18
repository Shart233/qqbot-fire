# 默认镜像包含新后台、管理页面、NapCat 和 Linux QQ。
ARG NAPCAT_IMAGE=mlikiowa/napcat-docker@sha256:f611790ecffa23c3c182017d5cf68179dc24612403608cd835ad13d79642f1bd
FROM node:24.21.0-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY server/package.json server/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/onebot/package.json packages/onebot/package.json
COPY web-ui/package.json web-ui/package.json
RUN npm ci --include=dev --no-audit --no-fund
COPY server/ server/
COPY packages/ packages/
COPY web-ui/ web-ui/
RUN npm run build:server && npm --prefix web-ui run build
RUN npm prune --omit=dev --no-audit --no-fund


FROM ${NAPCAT_IMAGE} AS runtime
USER root
RUN sed -i 's|http://|https://|g' /etc/apt/sources.list && apt-get update && apt-get install -y --no-install-recommends --fix-broken tini xauth ca-certificates xdg-utils && rm -rf /var/lib/apt/lists/*
COPY --from=build /usr/local/bin/node /usr/local/bin/node
# 上游把运行包留在压缩文件中；构建时解包，启动时无需下载或联网升级。
RUN mkdir -p /opt/napcat /opt/qqbot /app/data && unzip -q /app/NapCat.Shell.zip -d /opt/napcat && test -f /opt/napcat/napcat.mjs
COPY docker/patch-napcat-login.cjs /opt/qqbot/docker/patch-napcat-login.cjs
RUN node /opt/qqbot/docker/patch-napcat-login.cjs /opt/napcat/napcat.mjs
COPY docker/napcat-run.sh /opt/napcat/napcat-run.sh
COPY docker/load-napcat.cjs /opt/QQ/resources/app/loadNapCat.js
RUN chmod +x /opt/napcat/napcat-run.sh && chown -R napcat:napcat /app/data
WORKDIR /opt/qqbot
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/package.json ./server/package.json
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/packages ./packages
COPY --from=build /app/web-ui/package.json ./web-ui/package.json
COPY --from=build /app/web-ui/dist ./web-ui/dist
ENV NODE_ENV=production HOST=0.0.0.0 PORT=9988 DATA_DIR=/app/data STATIC_DIR=/opt/qqbot/web-ui/dist NAPCAT_MODE=managed NAPCAT_DIR=/opt/napcat NAPCAT_WORK_ROOT=/app/data/napcat-instances NAPCAT_AUTOSTART=true SCHEDULING_ENABLED=false TZ=Asia/Shanghai
USER napcat
VOLUME /app/data
EXPOSE 9988
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["/usr/bin/tini", "--", "node", "server/dist/main.js"]
