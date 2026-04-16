# AGENTS.md

QQ Bot client built on NapCat/OneBot 11. Two independent codebases in one repo: a Java backend and a React web UI.

## Repository layout

- `src/` — Java backend (pure JDK 24, no framework). Entry point: `src/Main.java`. Sources use flat `src/` not `src/main/java/`.
- `src/resources/web/` — **Build output** from web-ui. Do NOT edit directly; always rebuild from `web-ui/`.
- `web-ui/` — React SPA (management dashboard). Fully separate npm project.
- `lib/` — Vendored JARs (Log4j2, Gson). Checked into git; used only for manual javac builds.
- `scripts/` — NapCat multi-instance launcher scripts (bat/sh).

## Java backend

### Build & run

```bash
# Via Gradle (preferred)
./gradlew run

# IDE: run configurations "qqbot-fire [:run]" (Gradle) or "QQBot-fire" (Java app)
```

- Gradle `sourceSets.main.java.srcDirs("src")` — non-standard source root.
- Gradle `sourceSets.main.resources.srcDirs("src/resources")` — resources include `log4j2.xml` and the web build output.
- Dependencies: Log4j2 2.24.3, Gson 2.12.1 (Gradle pulls from Maven Central).
- **No test suite exists.** No CI/CD. No pre-commit hooks.

### Key packages

| Package | Purpose |
|---|---|
| `onebot.client` | WS + HTTP connections, API client (160+ methods) |
| `onebot.config` | `ConfigManager` — persistence of bot/NapCat config to `config.json` |
| `onebot.web` | Embedded HTTP server (JDK `HttpServer`), REST API (30+ endpoints) |
| `onebot.napcat` | NapCat process management, config discovery |
| `onebot.console` | Interactive CLI (`BotConsole`) |
| `onebot.handler` | Event dispatcher (chain-of-responsibility) |
| `onebot.scheduler` | NTP-synced scheduled messages (per-bot) |
| `onebot.util` | `GsonFactory`, `CryptoUtil` (RSA), `ConvertUtil`, `NtpUtil` |

## Web UI

### Commands

```bash
cd web-ui
npm run dev          # Vite dev server on :5173, proxies /api -> :9988
npm run build        # tsc -b && vite build -> web-ui/dist/
npm run deploy       # build + copy dist/ -> src/resources/web/
npm run lint         # ESLint
```

**`npm run deploy` is the canonical way to ship UI changes.** It builds and copies output into the Java resources tree so the embedded HTTP server can serve it.

### Stack & versions (non-obvious)

- React 19, Vite 8, TypeScript 6, Tailwind CSS v4, HeroUI v3, framer-motion v12
- Tailwind v4 uses **CSS-first config** (`@theme` in `index.css`), NOT `tailwind.config.js`.
- Theme variables are plain CSS custom properties in `web-ui/src/index.css` (`:root`/`.dark`/`.light`), bridged to Tailwind via `@theme { --color-*: var(--*) }`.
- Dark/light mode via `next-themes` with `attribute="class"` (`.dark`/`.light` on `<html>`).
- Routing: `react-router-dom` v7 with `createHashRouter` (hash-based, no server-side routing needed).
- State: Zustand stores in `web-ui/src/stores/`.
- Custom hooks in `web-ui/src/hooks/`.

### TypeScript quirk

framer-motion v12 `Variants` type requires cubic-bezier arrays to be cast:
```ts
ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
```
Without the tuple assertion, TS errors with `number[] is not assignable to Easing`.

### Key directories

| Path | Purpose |
|---|---|
| `web-ui/src/index.css` | All theme colors + Tailwind tokens |
| `web-ui/src/api/` | REST client (talks to Java backend on `/api/*`) |
| `web-ui/src/components/layout/` | Sidebar, Topbar, StatusIndicator |
| `web-ui/src/components/shared/` | GlassCard, ThemeToggle, MotionWrappers, etc. |
| `web-ui/src/pages/` | Route pages (Dashboard, Bots, Messages, Contacts, Schedules, NapCat, Console, Logs) |
| `web-ui/src/stores/` | Zustand stores |
| `web-ui/src/hooks/` | Custom React hooks |
| `web-ui/scripts/copy-dist.mjs` | Post-build copy script |

## Gotchas

- **Never edit `src/resources/web/` by hand.** Always edit under `web-ui/src/` and run `npm run deploy`.
- The Vite dev server proxies `/api` to `http://127.0.0.1:9988` — the Java backend must be running for the UI to work in dev mode.
- Build produces a single chunk >500KB (expected; no code-splitting configured).
- `config.json`, `.keys/`, `schedules*.json`, and `logs/` are gitignored runtime artifacts.
- The project language is primarily Chinese (comments, UI strings, README).
- Java sources have no package declaration matching a directory — `Main.java` is in the default package, everything else is under `onebot.*` but lives directly in `src/onebot/`.
