# AGENTS.md

QQ Bot client built on NapCat/OneBot 11. Two independent codebases in one repo: a Java backend and a React web UI.

## Repository layout

- `src/` — Java backend (pure JDK 24, no framework). Entry point: `src/Main.java`.
- `src/resources/web/` — **Build output** from web-ui. Do NOT edit; always rebuild from `web-ui/`.
- `web-ui/` — React SPA (management dashboard). Fully separate npm project.
- `lib/` — Vendored JARs. Only used for manual `javac` builds; Gradle ignores them.
- `scripts/` — NapCat multi-instance launcher scripts (bat/sh).
- `Dockerfile` + `docker-compose.yml` + `docker-entrypoint.sh` — Production Docker setup (qqbot-fire + NapCat).

## Java backend

### Build & run

```bash
./gradlew run                    # build + run (preferred)
./gradlew compileJava            # compile only
./gradlew installDist            # create distributable in build/install/qqbot-fire/
```

IDE run configs: `qqbot-fire [:run]` (Gradle) or `QQBot-fire` (Java app).

### Non-standard source layout (critical)

- `sourceSets.main.java.srcDirs("src")` — sources live in `src/`, NOT `src/main/java/`.
- `sourceSets.main.resources.srcDirs("src/resources")` — includes `log4j2.xml` and the web build output.
- `Main.java` is in the **default package**. All other classes are `onebot.*` under `src/onebot/`.
- Dependencies: Log4j2 2.24.3, Gson 2.12.1 (Gradle pulls from Maven Central).
- **No tests exist.** No CI/CD. No pre-commit hooks. No linter for Java.

### Key packages

| Package | Purpose |
|---|---|
| `onebot.client` | WS + HTTP connections, API client (160+ methods) |
| `onebot.config` | `ConfigManager` — persistence to `config.json` |
| `onebot.web` | Embedded HTTP server (JDK `HttpServer`), REST API (30+ endpoints) |
| `onebot.napcat` | NapCat process management, config discovery |
| `onebot.console` | Interactive CLI (`BotConsole`) — the app's entry loop |
| `onebot.handler` | Event dispatcher (chain-of-responsibility) |
| `onebot.scheduler` | NTP-synced scheduled messages (per-bot) |
| `onebot.util` | `GsonFactory`, `CryptoUtil` (RSA), `ConvertUtil`, `NtpUtil` |

## Web UI

### Commands

```bash
cd web-ui
npm run dev          # Vite dev server on :5173, proxies /api -> :9988
npm run build        # tsc -b && vite build -> web-ui/dist/
npm run deploy       # build + copy dist/ -> src/resources/web/  ← canonical way to ship UI changes
npm run lint         # ESLint
```

**After any UI change, run `npm run deploy`** (in `web-ui/`) to rebuild and copy output into the Java resources tree. The embedded HTTP server serves from `src/resources/web/`.

### Stack & non-obvious conventions

- React 19, Vite 8, TypeScript 6, Tailwind CSS v4, HeroUI v3, framer-motion v12.
- **Tailwind v4 CSS-first config**: tokens defined via `@theme` in `web-ui/src/index.css`, NOT `tailwind.config.js` (no such file exists).
- Theme colors are CSS custom properties in `web-ui/src/index.css` (`:root`), bridged to Tailwind via `@theme { --color-*: var(--*) }`.
- Dark/light mode: `next-themes` with `attribute="class"`.
- Routing: `react-router-dom` v7 with `createHashRouter` (hash-based).
- State: Zustand stores in `web-ui/src/stores/`.

### TypeScript quirk

framer-motion v12 requires cubic-bezier arrays cast as tuples:
```ts
ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
```
Without this, TS errors with `number[] is not assignable to Easing`.

## Docker

- `docker compose up -d` starts both `napcat` (official image `mlikiowa/napcat-docker:latest`) and `qqbot-fire` (built from repo Dockerfile).
- NapCat container exposes WS `:3000`, HTTP `:3001`, WebUI `:6099`. qqbot-fire exposes `:9988`.
- Containers share network `qqbot-fire-net`; qqbot-fire connects to NapCat via `ws://napcat:3000` (container name as hostname).
- Dockerfile is a multi-stage build: `eclipse-temurin:24-jdk` (build) → `eclipse-temurin:24-jre` (runtime).
- `docker-entrypoint.sh` symlinks runtime files (`config.json`, `.keys/`, `logs/`, `schedules*.json`) to the `/app/data` volume for persistence.
- Named volumes: `napcat-qq` (QQ login data), `napcat-config` (NapCat config), `qqbot-fire-data` (app state).

## Gotchas

- **Never edit `src/resources/web/` by hand.** Always edit under `web-ui/src/` and run `npm run deploy`.
- Vite dev server proxies `/api` → `http://127.0.0.1:9988` — the Java backend must be running for the UI to work in dev mode.
- `config.json`, `.keys/`, `schedules*.json`, and `logs/` are gitignored runtime artifacts.
- The project language is primarily Chinese (comments, UI strings, README).
- Web build produces a single chunk >500 KB (expected; no code-splitting configured).
- `Main.java` is in the default package — do not add a `package` declaration to it.
