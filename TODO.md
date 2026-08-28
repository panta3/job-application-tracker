# TODO — Job Application Tracker

Target: finish in September, small scope, days not weeks.

- [ ] Finalize `prisma/schema.prisma` fields (status enum, dates) and run first migration
- [ ] `GET /api/applications` — list all, sortable by date/status
- [ ] `POST /api/applications` — create
- [ ] `PATCH /api/applications/[id]` — update status/notes
- [ ] `DELETE /api/applications/[id]`
- [ ] Dashboard page: table view + funnel stat cards (applied / interview / offer counts)
- [ ] Follow-up flag: highlight rows with no status change in 14+ days
- [ ] Seed a few real applications once it works, start using it for real
- [ ] Deploy (Vercel is the path of least resistance given Next.js)
- [ ] README screenshots + resume bullet once deployed
