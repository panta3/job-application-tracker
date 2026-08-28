"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    // Native confirm() is enough for a single-user tool — no need for a
    // custom modal component just to guard a destructive action here.
    if (!confirm("Delete this application?")) return;

    setDeleting(true);
    const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });

    if (!res.ok) {
      alert("Delete failed — check the server logs.");
      setDeleting(false);
      return;
    }

    router.refresh();
    // No need to reset `deleting` — once refresh() re-renders, this row
    // (and this component instance) won't exist anymore.
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-rose-600 text-sm font-medium px-2 py-1 rounded-lg hover:bg-rose-50 disabled:opacity-50 transition-colors"
    >
      {deleting ? "..." : "Delete"}
    </button>
  );
}
