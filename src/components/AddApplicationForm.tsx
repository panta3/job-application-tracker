"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";

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
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap sm:flex-nowrap">
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company"
        required
        className="border border-line-bright bg-bg rounded-lg px-3 py-2 flex-1 min-w-[140px] text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
      />
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        required
        className="border border-line-bright bg-bg rounded-lg px-3 py-2 flex-1 min-w-[140px] text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
      />
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-bright text-[#04100e] rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 transition-colors"
      >
        <FaPlus size={11} />
        {submitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
