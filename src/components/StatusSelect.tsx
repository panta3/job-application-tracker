"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUSES, STATUS_COLORS, type Status } from "@/lib/status";

export function StatusSelect({ id, status }: { id: string; status: string }) {
  // Prisma types `status` as a plain string (SQLite has no enum type), but
  // the app layer only ever writes one of the five known values into it —
  // safe to treat it as `Status` here for the color lookup.
  const colors = STATUS_COLORS[status as Status];
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setUpdating(true);

    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: e.target.value }),
    });

    setUpdating(false);

    if (!res.ok) {
      alert("Status update failed — check the server logs.");
      return;
    }

    router.refresh(); // same pattern as the create form — pull fresh data after the mutation
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={updating}
      className={`border rounded-lg px-2 py-1.5 text-sm font-medium disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50 ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
