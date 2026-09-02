# 📋 Job Application Tracker

**🔗 Live: https://job-application-tracker-alpha-lime.vercel.app**

Personal CRM for the job/co-op search: log applications, see funnel stats at a
glance, get reminded before a follow-up goes stale. Built because I'm tracking
this by hand right now anyway — might as well be the thing I put on my resume.

**Status:** ✅ deployed and live — CRUD, status pipeline, dashboard, and
follow-up flag all working against a real Postgres database, not a local demo.

---

## 🧱 Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS — dark/cyan theme matching the rest of the portfolio
  (same Chakra Petch + IBM Plex fonts), kept functional rather than
  decorative since this is a tool used for real daily data entry
- Prisma + Postgres (Neon, provisioned via Vercel's marketplace integration)

## 🎯 Why this stack
Fast to stand up, one codebase for frontend + API, and it's all stuff already
on the resume — no new tech to learn just to build this one.

## ✅ Core features (MVP scope — keep it small)
- [x] 📝 CRUD on applications: company, role, status, applied date, notes
- [x] 🔀 Status pipeline: Applied → OA → Interview → Offer / Rejected
- [x] 📊 Dashboard: funnel counts per stage
- [x] ⏰ Follow-up reminder flag (no status change in 14 days)

## 🧠 Design decisions
- **Postgres in both dev and prod** — this is a single-user personal tool,
  so there's no real benefit to a separate local database; local dev and
  production point at the same Neon instance. (Originally SQLite locally
  with a documented "swap the provider for Postgres, no code changes
  required" plan for prod — that turned out to be inaccurate: Prisma's
  `provider` field in `schema.prisma` has to literally say `"postgresql"`,
  not just the connection string. Fixed by actually deploying, not just
  planning to.)
- **Validation happens once, at the API boundary** — `POST`/`PATCH`
  requests are checked against Zod schemas before anything touches Prisma.
  Everything downstream (the DB call, the components) trusts the shape of
  the data instead of re-validating it at every layer.
- **Indexes match actual query patterns, not every column** — `status` is
  indexed because the funnel stat cards filter by it; `lastUpdated` is
  indexed because the dashboard's default sort and the stale-application
  check both key off it. No index exists that isn't backing a real query.
- **Status is a plain string, not a DB enum** — now that this runs on
  Postgres it *could* be a real database enum (SQLite never supported
  one), but that's a deliberate follow-up, not bundled into the same
  change as the provider migration. Enforced in TypeScript
  (`src/lib/status.ts`) for now.

## 🚫 Explicitly out of scope for v1
- Auth / multi-user (this is a single-user personal tool)
- Email parsing / auto-import
- Notifications beyond an in-app flag

## 🚀 Setup
```bash
npm install
vercel env pull .env.local   # or set DATABASE_URL to your own Postgres instance
npx prisma migrate dev
npm run dev
```

## 🐛 A real bug found deploying this
The dashboard showed **0 applications** even right after a write succeeded
via the API. Root cause: a direct Prisma call inside a Server Component
doesn't tell Next.js's App Router the route needs to render per-request —
unlike `fetch()`, which Next's patched version can detect and
cache/revalidate automatically, a raw database query gives it no such
signal. Without an explicit opt-out, the router was free to treat the
page as static and had cached it from build time, when the table was
still empty. Fixed with `export const dynamic = "force-dynamic"` in
`src/app/page.tsx` — verified live by adding a real row, confirming it
appeared, deleting it, and confirming it disappeared.

## 📌 Status
Deployed and live (see the link at the top), running against a real
Postgres database. See `TODO.md` for what's left.
