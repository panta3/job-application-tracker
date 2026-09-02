"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";

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
      aria-label="Delete application"
      className="inline-flex items-center justify-center text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 disabled:opacity-50 transition-colors"
    >
      <FaTrash size={13} />
    </button>
  );
}
