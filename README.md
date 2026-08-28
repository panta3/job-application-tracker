# Job Application Tracker

Personal CRM for the job/co-op search: log applications, see funnel stats at a
glance, get reminded before a follow-up goes stale. Built because I'm tracking
this by hand right now anyway — might as well be the thing I put on my resume.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + SQLite (swap to Postgres for prod — see `.env.example`)

## Why this stack
Fast to stand up, one codebase for frontend + API, and it's all stuff already
on the resume — no new tech to learn just to build this one.

## Core features (MVP scope — keep it small)
- [x] CRUD on applications: company, role, status, applied date, notes
- [x] Status pipeline: Applied → OA → Interview → Offer / Rejected
- [x] Dashboard: funnel counts per stage
- [x] Follow-up reminder flag (no status change in 14 days)

## Design decisions
- **SQLite for dev, Postgres for prod, no code changes required** — the
  datasource is entirely driven by `DATABASE_URL`. Local dev stays
  zero-setup; swapping the connection string is the only change needed to
  point at Postgres in production.
- **Validation happens once, at the API boundary** — `POST`/`PATCH`
  requests are checked against Zod schemas before anything touches Prisma.
  Everything downstream (the DB call, the components) trusts the shape of
  the data instead of re-validating it at every layer.
- **Indexes match actual query patterns, not every column** — `status` is
  indexed because the funnel stat cards filter by it; `lastUpdated` is
  indexed because the dashboard's default sort and the stale-application
  check both key off it. No index exists that isn't backing a real query.
- **Status is a plain string, not a DB enum** — SQLite has no native enum
  type, so `ApplicationStatus` is enforced in TypeScript (`src/lib/status.ts`)
  instead of at the schema level. Trade-off made explicit rather than
  discovered by a failed migration.

## Explicitly out of scope for v1
- Auth / multi-user (this is a single-user personal tool)
- Email parsing / auto-import
- Notifications beyond an in-app flag

## Setup
```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

## Status
MVP complete — CRUD, status pipeline, dashboard, and follow-up flag all
working. Remaining: deploy to Vercel. See `TODO.md`.
