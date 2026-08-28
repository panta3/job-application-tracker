"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddApplicationForm() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role }),
    });

    setSubmitting(false);

    if (!res.ok) {
      alert("Adding the application failed — check the server logs.");
      return;
    }

    setCompany("");
    setRole("");

    // The dashboard's data lives in a Server Component (page.tsx), which
    // already ran on the server before this form ever mounted. Nothing
    // automatically tells it the database changed — router.refresh() is
    // what re-runs that Server Component so the new row shows up.
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company"
        required
        className="border border-slate-300 rounded-lg px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        required
        className="border border-slate-300 rounded-lg px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 transition-colors"
      >
        {submitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
