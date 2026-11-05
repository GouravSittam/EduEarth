# EduEarth

EduEarth is a gamified environmental education platform for students, teachers, and institutions. The project combines a Next.js learning experience, a role-aware auth flow, an Express/Prisma API, real-time Socket.io game services, Supabase authentication, a Gemini-powered eco assistant, and a Python/Airflow workspace for environmental article and data ingestion workflows.

![EduEarth home](project_screenshots/1_home.png)

## Current Highlights

- Role-aware auth at `/auth-model` with callback handling at `/auth/callback`. The client probes Supabase reachability, shows a service-status message instead of looping on token refresh, and surfaces clear auth errors.
- Student and teacher dashboards with automatic routing from the homepage and auth state. Students can join a school from the dashboard (`JoinSchoolCard`), and progress is shown as eco-points, levels, and streaks.
- Educator role restrictions: only teachers (and admins) can create or edit classes, lessons, lesson modules, quizzes, and questions, or view rosters.
- An eco-points leaderboard, global or per institution, that exposes only display names and avatars.
- "Eco", an AI assistant chat backed by Gemini. The key stays on the server, requests are rate limited per IP, and the chat is hidden when the assistant isn't configured.
- Environmental articles page with auto-refresh, image support, and optional AI summaries.
- Interactive game hub with Recycle Rush, Eco Strike, and Eco Sprint.
- Learning modules, course detail pages, assignments, missions, and certificates UI.
- Dynamic Open Graph and Twitter share images.
- REST APIs for auth, institutions, classes, lessons, quizzes, articles, leaderboard, assistant, game health/stats, flow views, and Prometheus metrics.
- Prisma schema for users, institutions, classes, lessons, quizzes, challenges, badges, achievements, leaderboards, notifications, articles, and ingestion/outbox support.
- Server outbox publisher for realtime game and ingestion event fan-out.
- Hardened API: Helmet, an allow-listed CORS policy, request IDs, JSON 404/error responses, and an optional Redis cache.
- Docker support at the repository root (client, server, optional Postgres and Redis) and inside `server/` for development and production workflows.
- Python/Airflow ingestion pipeline with external providers (Open-Meteo climate API and environmental RSS sources).

## Tech Stack

| Area       | Tools                                                           |
| ---------- | --------------------------------------------------------------- |
| Client     | Next.js 15, React 19, TypeScript, Tailwind CSS 4, Framer Motion |
| Server     | Node.js 20, Express 5, TypeScript, Socket.io, Helmet            |
| Data       | PostgreSQL, Prisma 6, Supabase, optional Redis cache            |
| Auth       | Supabase Auth with server-side token validation and role guards |
| AI         | Google Gemini (`gemini-2.5-flash`) via the server               |
| ETL        | Python, Apache Airflow/Astronomer                               |
| Ops        | Pino logging, Prometheus metrics, Docker                        |
| Deployment | Docker, Docker Compose, Vercel (client and API)                 |

## Repository Structure

```text
EduEarth/
  client/                 Next.js application
    app/                  App Router pages and route groups
    app/auth-model/       Auth UI and role selection
    app/games/            Game hub and game routes
    components/           Shared UI, auth, assistant, and game components
    lib/                  API client, Supabase, server URL, and type helpers
    public/               Images and game assets
  server/                 Express API and Socket.io server
    src/controllers/      Route handlers
    src/routes/           API route definitions
    src/middlewares/      validToken, optionalAuth, requireRole/requireEducator
    src/game/             Real-time game server
    src/services/         Outbox, cache, progress, assistant, and domain services
    src/observability/    Metrics and logging helpers
    src/prisma/           Prisma schema and migrations
    src/utils/            Supabase, mail, parsing, Prisma-error, and response helpers
    perf/                 Smoke and load performance scripts
  python/                 Airflow/Astronomer ingestion project
  docs/architecture/      Architecture notes (environmental ingestion V2)
  research-paper/         Project research paper (PDF)
  project_screenshots/    Product screenshots, diagrams, and demo video
  .agents/skills/         Agent skills (pinned in skills-lock.json, plus the project skill)
  .claude/                Claude Code project settings and skills
  docker-compose.yml      Full-stack compose (client, server, optional db/cache)
```

## Screenshots

| Home                                    | Student Dashboard                                                |
| --------------------------------------- | ---------------------------------------------------------------- |
| ![Home](project_screenshots/1_home.png) | ![Student dashboard](project_screenshots/2_StudentDashboard.png) |

| Teacher Dashboard                                                | Articles                                        |
| ---------------------------------------------------------------- | ----------------------------------------------- |
| ![Teacher dashboard](project_screenshots/3_TeacherDashboard.png) | ![Articles](project_screenshots/4_Articles.png) |

| Games                                     | Modules                                       |
| ----------------------------------------- | --------------------------------------------- |
| ![Games](project_screenshots/5_Games.png) | ![Modules](project_screenshots/6_Modules.png) |

| Course Detail                                             | Eco Sprint                                              |
| --------------------------------------------------------- | ------------------------------------------------------- |
| ![Course detail](project_screenshots/12_CourseDetail.png) | ![Eco Sprint](project_screenshots/8_Game_EcoSprint.png) |

| Eco Strike                                              | Recycle Rush                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| ![Eco Strike](project_screenshots/9_Game_EcoStrike.png) | ![Recycle Rush](project_screenshots/11_Game_RecycleRush.png) |

## Prerequisites

- Node.js 20 or newer (the Docker images use `node:20-alpine`)
- npm or Bun
- PostgreSQL database, usually Supabase Postgres
- Supabase project with public URL and publishable key
- Docker with Compose v2, optional for containerised runs
- Gemini API key, optional, for the eco assistant
- Astronomer CLI, optional for the Python/Airflow workspace

## Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT="6969"
SERVER_BASE_URL="http://localhost:6969"
CLIENT_BASE_URL="http://localhost:3000"
# Extra front-end origins allowed by CORS, comma-separated (e.g. preview deploys)
CORS_ORIGINS=""

NODE_ENV="development" # or production
LOG_LEVEL="info"

DATABASE_URL="postgresql://postgres.<project-ref>:[YOUR-PASSWORD]@aws-<region>.pooler.supabase.com:5432/postgres?sslmode=require"
SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_PUBLISHABLE_KEY=""

# Optional Redis cache (stats, article lists, leaderboard). Leave empty to disable.
REDIS_URL=""

# Eco AI assistant (server-side only)
GEMINI_API_KEY=""
GEMINI_MODEL="gemini-2.5-flash"
```

| Variable                                       | Required | Purpose                                                                                 |
| ---------------------------------------------- | -------- | --------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                 | yes      | Postgres connection (Supabase session pooler recommended)                               |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`     | yes      | Server-side validation of Supabase access tokens                                        |
| `CLIENT_BASE_URL`, `CORS_ORIGINS`              | yes / no | CORS allow-list. `localhost` origins are always allowed in development                  |
| `REDIS_URL`                                    | no       | Enables the Redis cache. Without it, caching is a no-op                                 |
| `GEMINI_API_KEY`, `GEMINI_MODEL`               | no       | Enables `/assistant/chat`. Without them, `/assistant/status` reports `enabled: false`  |
| `GMAIL_USER`, `GMAIL_PASS`                     | no       | Outgoing mail via `utils/sendMail.ts`                                                   |
| `OUTBOX_POLL_INTERVAL_MS`, `OUTBOX_BATCH_SIZE` | no       | Outbox publisher tuning (defaults `3000` / `50`)                                        |

Create `client/.env.local` from `client/.example.env`:

```env
NEXT_PUBLIC_SERVER_URL="http://localhost:6969"
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=""
# Keep a localhost API URL in production builds (Docker sets this for you)
NEXT_PUBLIC_ALLOW_LOCAL_SERVER=""
```

Only publishable or anon keys belong in `NEXT_PUBLIC_*` variables, because they are shipped to every browser. The Gemini key lives on the server. In production builds, a `localhost` `NEXT_PUBLIC_SERVER_URL` falls back to the deployed backend (`https://edu-earth-backend.vercel.app`) unless `NEXT_PUBLIC_ALLOW_LOCAL_SERVER=true`.

## Local Development

Install dependencies:

```bash
cd client
npm install

cd ../server
npm install
```

Prepare Prisma:

```bash
cd server
npx prisma generate
npx prisma migrate dev
```

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend in another terminal:

```bash
cd client
npm run dev
```

Open:

- Client: http://localhost:3000 (redirects to `/home`)
- API: http://localhost:6969
- API health: http://localhost:6969/health
- Game health: http://localhost:6969/game/health
- Flow view: http://localhost:6969/flow
- Metrics: http://localhost:6969/metrics

The client also proxies `/api/*` to the server through a Next.js rewrite.

## Available Scripts

Client:

```bash
npm run dev      # Start Next.js development server
npm run build    # Build production client
npm run start    # Serve production build
npm run lint     # Run ESLint
npm run build:analyze  # Build with bundle analysis enabled
npm run perf:lighthouse # Run Lighthouse CI against the app routes
```

Server:

```bash
npm run dev      # Start Express server with tsx watch
npm run build    # Generate Prisma client and compile TypeScript
npm run start    # Run compiled server
npm run lint     # Type-check without emitting files
npm run clean    # Remove build output
npm run perf:smoke # Run the smoke performance check
npm run perf:load  # Run the load performance check
```

## API Overview

Base URL: `http://localhost:6969`

| Resource     | Endpoints                                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Health       | `GET /health`                                                                                                                             |
| Metrics      | `GET /metrics`                                                                                                                            |
| Flow         | `GET /flow`, `GET /flow/data`                                                                                                             |
| Auth         | `GET /auth/user`, `POST /auth/user`, `PATCH /auth/user`                                                                                   |
| Institutions | `GET/POST /institutions`, `GET/PUT/DELETE /institutions/:id`, `POST /institutions/:id/join`, statistics, students¹, teachers¹, classes    |
| Classes      | `GET /classes`, `POST /classes`¹, `GET /classes/:id`, `PUT/DELETE /classes/:id`¹, student¹ and teacher¹ enrollment, statistics            |
| Lessons      | `GET /lessons`, `POST /lessons`¹, `GET /lessons/:id`, `PUT/DELETE /lessons/:id`¹, `POST /lessons/:id/complete`, completions, modules²     |
| Quizzes      | `GET /quizzes`, `POST /quizzes`¹, `GET /quizzes/:id`, `PUT/DELETE /quizzes/:id`¹, questions¹, `POST /quizzes/:id/attempt`, attempts       |
| Articles     | `GET/POST /articles`, `GET/PUT/DELETE /articles/:id`, source, section, statistics                                                         |
| Leaderboard  | `GET /leaderboard?institutionId=&limit=` (public, max 50 entries)                                                                         |
| Assistant    | `GET /assistant/status`, `POST /assistant/chat` (rate limited per IP)                                                                     |
| Games        | `GET /game/health`, `GET /game/stats`, Socket.io game events                                                                              |

¹ Educator only: needs a `TEACHER` (or admin) account. Everyone else gets `403`.
² Reading lesson modules is public. Creating, editing, and deleting them is educator only.

Protected routes expect a Supabase bearer token:

```http
Authorization: Bearer <supabase-access-token>
```

All responses, including 404s and errors, use the JSON shape `{ success, message, data, error }`. Each response carries an `x-request-id` header.

## Games

- `Recycle Rush`: waste sorting game with custom image assets.
- `Eco Strike`: 1v1 quiz battle where correct answers trigger attacks.
- `Eco Sprint`: real-time eco quiz race powered by Socket.io.

Game pages live under `client/app/games`, with reusable components in `client/components/games`.

## Eco Assistant

The floating "Eco" chat (`client/components/bot.tsx`) talks only to the API server (`/assistant/chat`). The server holds `GEMINI_API_KEY`, keeps the last 20 messages (up to 2,000 characters each), applies a per-IP quota, and returns `429` with `Retry-After` when that quota is exceeded. The chat stays hidden unless `GET /assistant/status` reports `enabled: true`.

## Articles And ETL

The article UI reads from the server `/articles` API and displays environmental stories from the database. Article records support:

- headline, body, source, section, URL
- publish and extracted dates
- image URL
- optional AI summary

The `python/` folder contains an Airflow/Astronomer ingestion pipeline that decouples external data fetching from the server.

- Architecture document: `docs/architecture/environmental-ingestion-v2.md`
- Airflow DAG: `python/dags/environmental_ingestion_v2.py`
- SQL contract: `python/include/sql/environmental_ingestion_contract.sql`

In the V2 model, external providers are fetched by Python scrapers scheduled by Airflow, while the Express server serves historical data and pushes realtime updates from the outbox publisher.

Configured external providers:

- Climate API: Open-Meteo (`https://api.open-meteo.com`)
- RSS feeds: Guardian Environment, UNEP RSS, NASA Earth RSS

Curriculum enrichment is applied in the Airflow DAG before persistence (`curriculum_topic`, `grade_band`, `learning_objective`, tags, relevance score).

## Docker

The repository includes Docker support for the full stack and service-level deployment.

### Full stack from repository root

1. Create the env files:

- `server/.env` (based on `server/.env.example`)
- `client/.env.local` (based on `client/.example.env`)

2. Build and start client + server:

```bash
docker compose --env-file client/.env.local up --build
```

Next.js inlines `NEXT_PUBLIC_*` values into the bundle at build time, so `--env-file` passes them in as build args. Compose also sets `NEXT_PUBLIC_ALLOW_LOCAL_SERVER=true`, so the containerised client talks to the local API instead of the deployed one. If you change any client env value, rebuild with `--build`.

Open:

- Client: http://localhost:3000
- API: http://localhost:6969

The client waits for the server health check (`/health`) before starting.

### Optional profiles

| Profile    | Service                | Set in `server/.env`                                                 |
| ---------- | ---------------------- | -------------------------------------------------------------------- |
| `local-db` | Postgres 16 on `:5432` | `DATABASE_URL=postgresql://eduearth:eduearth@postgres:5432/eduearth` |
| `cache`    | Redis 7 on `:6379`     | `REDIS_URL=redis://redis:6379`                                       |

```bash
docker compose --env-file client/.env.local --profile local-db --profile cache up --build
```

Auth still goes through your Supabase project when you use the local database. Before first use, apply migrations to it (`npx prisma migrate deploy` with `DATABASE_URL` pointing at `localhost:5432`).

### Server only

From `server/`:

```bash
docker compose up --build
```

This uses hot-reload (`npm run dev`) inside the container, with `src/` mounted.

From `server/`, with `server/.env.production` configured:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Python/Airflow Workspace

The `python/` folder is an Astronomer project. To start Airflow locally:

```bash
cd python
astro dev start
```

Import project connections and variables:

```bash
cd python
astro dev object import
```

In Airflow UI (`http://localhost:8080`):

1. Open DAGs.
2. Enable `environmental_ingestion_v2`.
3. Trigger a run.

What to verify after a run:

- `climate_observations` has climate records.
- `news_articles_ingested` has enriched RSS records.
- `websocket_outbox` has realtime events for server fan-out.

Airflow UI defaults to http://localhost:8080.

## AI Agent Skills

The repo ships agent skills so coding assistants follow the project's conventions:

| Skill                                  | Source                     | Location                                |
| -------------------------------------- | -------------------------- | --------------------------------------- |
| `eduearth-codebase`                    | this repo                  | `.agents/skills/` and `.claude/skills/` |
| `frontend-design`                      | `anthropics/skills`        | `.agents/skills/`                       |
| `Frontend Responsive Design Standards` | `am-will/codex-skills`     | `.agents/skills/`                       |
| `web-design-guidelines`                | `vercel-labs/agent-skills` | `.agents/skills/`                       |

- Third-party skills are pinned in `skills-lock.json`. Refresh them with the `skills` CLI (`npx skills update`) instead of editing them by hand.
- `eduearth-codebase` is maintained here. Claude Code reads `.claude/skills/`, so keep its two copies identical.
- `.claude/settings.json` holds shared Claude Code permissions. Personal overrides go in `.claude/settings.local.json`.

## Project Assets

Useful visual references are stored in `project_screenshots/`, including:

- architecture diagram: `arch.png`
- database diagram: `database.png`
- data-flow diagrams: `dfd_present_system.png`, `dfd_proposed_eduearth.png`
- authentication, Eco Sprint, and Airflow flow diagrams: `flow_*.png`
- demo video: `EduEarth.mp4`

The research paper is in `research-paper/Gourav_ResearchPaper_EduEarth.pdf`.

## Notes For Contributors

- Keep client code in TypeScript and follow the existing App Router structure.
- Keep server changes scoped by route/controller pairs, and guard educator-only writes with `validToken` + `requireEducator`.
- Add new env vars to the matching example file. For client build-time vars, also add them to `client/Dockerfile` and `docker-compose.yml`.
- Run `npm run lint` in `server` before changing API contracts.
- Run `npm run lint` and `npm run build` in `client` before UI releases.
- Update this README when routes, setup steps, environment variables, or major user-facing features change.
