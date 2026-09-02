import { prisma } from "@/lib/prisma";
import { AddApplicationForm } from "@/components/AddApplicationForm";
import { StatusSelect } from "@/components/StatusSelect";
import { DeleteButton } from "@/components/DeleteButton";
import { STATUSES, STATUS_COLORS, type Status } from "@/lib/status";

const STALE_DAYS = 14;

// A direct Prisma call here doesn't, by itself, tell Next.js this route
// needs to run per-request — unlike `fetch()`, which Next's patched
// version can detect and cache/revalidate automatically, a raw database
// query gives it no such signal. Without this, the App Router is free to
// treat the page as static and serve whatever HTML it built once at
// build time (when the table was empty) forever after — confirmed live:
// a real row written via POST /api/applications didn't show up on the
// page until this was added.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Server Component — this runs on the server at request time, so we can
  // query Prisma directly. No API round-trip needed just to render the page.
  const applications = await prisma.application.findMany({
    orderBy: { lastUpdated: "desc" },
  });

  // Funnel counts: how many applications are sitting in each status.
  // reduce() walks the array once, building up a { STATUS: count } map.
  const funnelCounts = STATUSES.reduce<Record<Status, number>>(
    (acc, status) => {
      acc[status] = applications.filter((a) => a.status === status).length;
      return acc;
    },
    {} as Record<Status, number>
  );

  // Anything untouched for STALE_DAYS and not already in a terminal state
  // (offer/rejected) gets flagged as needing a follow-up.
  const staleCutoff = new Date();
  staleCutoff.setDate(staleCutoff.getDate() - STALE_DAYS);

  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 grid-field pointer-events-none [mask-image:radial-gradient(ellipse_70%_100%_at_50%_0%,black_30%,transparent_100%)]" />
        <div className="relative max-w-5xl mx-auto px-6 py-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent mb-2">
            Job Search Pipeline
          </p>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-ink">
            Application Tracker
          </h1>
          <p className="text-ink-faint mt-1 text-sm">
            {applications.length} application
            {applications.length === 1 ? "" : "s"} tracked
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="rounded-2xl border border-line bg-bg-elevated p-5 mb-6">
          <AddApplicationForm />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {STATUSES.map((status) => {
            const colors = STATUS_COLORS[status];
            return (
              <div
                key={status}
                className={`rounded-xl border ${colors.border} ${colors.bg} p-4 text-center`}
              >
                <div className={`font-mono text-[11px] font-semibold uppercase tracking-wide ${colors.text}`}>
                  {status}
                </div>
                <div className="font-display text-3xl font-semibold mt-1 text-ink">
                  {funnelCounts[status]}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-line bg-bg-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-bg-elevated-2 border-b border-line">
                  <th className="py-3 px-4 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Company
                  </th>
                  <th className="py-3 px-4 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Role
                  </th>
                  <th className="py-3 px-4 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Status
                  </th>
                  <th className="py-3 px-4 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Applied
                  </th>
                  <th className="py-3 px-4 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Last Updated
                  </th>
                  <th className="py-3 px-4 font-mono text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const isStale =
                    app.lastUpdated < staleCutoff &&
                    app.status !== "OFFER" &&
                    app.status !== "REJECTED";

                  return (
                    <tr
                      key={app.id}
                      className="border-b border-line last:border-0 hover:bg-bg-elevated-2 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-ink whitespace-nowrap">
                        {app.company}
                      </td>
                      <td className="py-3 px-4 text-ink-soft whitespace-nowrap">{app.role}</td>
                      <td className="py-3 px-4">
                        <StatusSelect id={app.id} status={app.status} />
                      </td>
                      <td className="py-3 px-4 text-ink-faint font-mono text-xs whitespace-nowrap">
                        {app.appliedDate.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-ink-faint font-mono text-xs whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {app.lastUpdated.toLocaleDateString()}
                          {isStale && (
                            <span className="inline-flex items-center rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-medium px-2 py-0.5">
                              follow up
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <DeleteButton id={app.id} />
                      </td>
                    </tr>
                  );
                })}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-ink-faint">
                      No applications yet — add your first one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
