---
name: eduearth-codebase
description: Project conventions for the EduEarth monorepo (Next.js client, Express/Prisma/Socket.io server, Supabase auth, Python/Airflow ingestion). Use this skill whenever adding or changing an API route, controller, service, Prisma model, auth/role check, client API call, environment variable, Docker setup, or Airflow DAG in this repository, so the change follows the existing patterns.
---

# EduEarth Codebase Conventions

Follow these patterns. They are what the existing code does. When you change any of them, update `README.md` too.

## Layout

| Path | What lives there |
| --- | --- |
| `client/app/` | Next.js 15 App Router pages (`home`, `auth-model`, `auth/callback`, `student-dashboard`, `teacher-dashboard`, `articles`, `modules`, `course-detail`, `games/*`) |
| `client/components/` | Shared UI, `auth/AuthProvider.tsx`, `games/*` |
| `client/lib/` | `api.ts` (typed API client), `supabase.ts` (auth + reachability probe), `serverUrl.ts`, `types.ts` |
| `server/src/routes/` | One router per resource, mounted in `server/src/server.ts` |
| `server/src/controllers/` | Request handlers, paired with routes |
| `server/src/services/` | Domain logic: cache, outbox, progress, assistant, quizzes, classes, articles |
| `server/src/middlewares/` | `validToken`, `optionalAuth`, `requireRole`/`requireEducator` |
| `server/src/prisma/` | `schema.prisma`, migrations, client |
| `python/dags/` | Airflow DAGs (`environmental_ingestion_v2.py`) |

## Server rules

- **Responses.** Always reply through `sendResponse({ res, success, message, data, error, statusCode })` from `utils/ResponseHelpers.ts`. Errors use the `{ success: false, message, error: { message } }` shape, because the client expects JSON on every path.
- **Auth.** Add `validToken` to protected routes. It validates the Supabase bearer token and sets `req.user` (the Prisma `User`). Use `optionalAuth` when anonymous reads are allowed but a signed-in user changes the response.
- **Roles.** Put `requireEducator` (TEACHER, admins always pass) or `requireRole(...)` after `validToken` on any write to classes, lessons, lesson modules, quizzes or questions, and on any roster read. Use `isEducator(req.user)` for checks inside a handler.
- **Input parsing.** Use `utils/parse.ts` (`parseOptionalInt`, `parseOptionalBoolean`, `ValidationError`) and `utils/pagination.ts` (`parseBoundedPagination`). Never pass raw query strings to Prisma.
- **Prisma errors.** Map them with `utils/prismaErrors.ts`: `isUniqueViolation` → 409, `isRecordNotFound` → 404, `isForeignKeyViolation` → 400.
- **Caching.** Go through `cacheService` with short TTLs. Redis is optional (`REDIS_URL`), so the code must still work when the cache is a no-op.
- **Eco-points / levels.** Use `services/progress.service.ts` (`recordActivity`, `levelForPoints`) instead of recomputing them.
- **Public endpoints never expose emails.** The leaderboard returns only names and avatars.
- **Metrics.** Label routes by pattern (`req.baseUrl + req.route.path`), never by raw path.
- **New router.** Import it in `server.ts`, mount it under `/<resource>`, and add it to the README API table.

## Client rules

- Call the API only through `client/lib/api.ts` (`server`, `authApi`, `leaderboardApi`, `institutionsApi`, `classesApi`, `assistantApi`). It attaches the Supabase token and throws `ApiError`.
- Resolve the API base URL with `getServerUrl()` from `lib/serverUrl.ts`. In production a localhost URL falls back to the deployed backend unless `NEXT_PUBLIC_ALLOW_LOCAL_SERVER=true`.
- Auth state comes from `AuthProvider`. It probes Supabase reachability (`checkSupabaseReachable`), so do not add extra session refresh loops.
- Only publishable or anon keys may go in `NEXT_PUBLIC_*`. Secrets such as `GEMINI_API_KEY` stay on the server.

## Environment variables

Every new variable goes into `server/.env.example` or `client/.example.env`, with a comment, and into the README. Client `NEXT_PUBLIC_*` variables are build-time, so also add them as a build `ARG` in `client/Dockerfile` and under `build.args` in `docker-compose.yml`.

## Checks before finishing

```bash
cd server && npm run lint      # tsc --noEmit
cd client && npm run lint && npm run build
docker compose --env-file client/.env.local config --quiet   # if Docker files changed
```
