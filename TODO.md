# TODO — Job Application Tracker

## Build
- [x] `prisma/schema.prisma` + first migration
- [x] `GET`/`POST /api/applications`, `PATCH`/`DELETE /api/applications/[id]`
- [x] Dashboard page: table view + funnel stat cards
- [x] Follow-up flag: highlight rows with no status change in 14+ days
- [x] Dark/cyan UI redesign matching the rest of the portfolio (functional,
      not decorative — no 3D/heavy animation, this is a real data-entry tool)

## Deploy (this session)
- [x] Migrated SQLite → Postgres (Neon, via Vercel marketplace) — SQLite's
      file-based storage doesn't persist on Vercel's serverless filesystem
- [x] Deployed to Vercel: **https://job-application-tracker-alpha-lime.vercel.app**
- [x] Fixed a real bug found via live testing: the dashboard was serving a
      statically-cached empty page instead of querying Postgres per
      request (`export const dynamic = "force-dynamic"` — see README)
- [x] Verified live: added a real application via the API, confirmed it
      rendered on the page, deleted it, confirmed it disappeared

## Next
- [ ] Start actually using it for real applications
- [ ] Resume bullet + live link (matches the pattern used for the other
      two projects once they went live)
- [ ] Consider: `status` as a real Postgres enum now that SQLite isn't
      the constraint anymore (documented as deliberately deferred, not
      forgotten — see README)
- [ ] README screenshot of the real dashboard once it has real data in it
