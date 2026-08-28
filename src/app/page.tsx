import { prisma } from "@/lib/prisma";
import { AddApplicationForm } from "@/components/AddApplicationForm";
import { StatusSelect } from "@/components/StatusSelect";
import { DeleteButton } from "@/components/DeleteButton";
import { STATUSES, STATUS_COLORS, type Status } from "@/lib/status";

const STALE_DAYS = 14;

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
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-5xl mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Job Application Tracker
          </h1>
          <p className="text-slate-500 mt-1">
            {applications.length} application
            {applications.length === 1 ? "" : "s"} tracked
          </p>
        </header>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
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
                <div className={`text-xs font-semibold uppercase tracking-wide ${colors.text}`}>
                  {status}
                </div>
                <div className={`text-3xl font-bold mt-1 ${colors.text}`}>
                  {funnelCounts[status]}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Company
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Applied
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Last Updated
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {app.company}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{app.role}</td>
                    <td className="py-3 px-4">
                      <StatusSelect id={app.id} status={app.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-sm">
                      {app.appliedDate.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-sm">
                      <div className="flex items-center gap-2">
                        {app.lastUpdated.toLocaleDateString()}
                        {isStale && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5">
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
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No applications yet — add your first one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
