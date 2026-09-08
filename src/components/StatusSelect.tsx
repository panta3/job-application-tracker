"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "react-icons/fa6";
import { STATUSES, STATUS_COLORS, type Status } from "@/lib/status";

export function StatusSelect({ id, status }: { id: string; status: string }) {
  // Prisma types `status` as a plain string (SQLite has no enum type), but
  // the app layer only ever writes one of the five known values into it —
  // safe to treat it as `Status` here for the color lookup.
  const colors = STATUS_COLORS[status as Status];
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // A native <select>'s closed control can be themed, but its open option
  // list is rendered by the OS/browser and mostly ignores CSS — on a dark
  // UI that means a jarring white dropdown. Built as a real button + panel
  // instead so every pixel of it, open or closed, matches the theme.
  //
  // The panel is portaled to document.body rather than rendered inline:
  // the table it lives in is wrapped in `overflow-x-auto` (for horizontal
  // scroll on mobile) inside a `overflow-hidden` rounded card (for the
  // corner radius) — per the CSS spec, setting overflow-x on an element
  // forces its overflow-y to at least `auto` too, so an inline
  // absolutely-positioned panel got silently clipped the instant it
  // extended past either container's bottom edge. Portaling escapes both.
  function openDropdown() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        panelRef.current && !panelRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleSelect(next: Status) {
    setOpen(false);
    if (next === status) return;
    setUpdating(true);

    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });

    setUpdating(false);

    if (!res.ok) {
      alert("Status update failed — check the server logs.");
      return;
    }

    router.refresh(); // same pattern as the create form — pull fresh data after the mutation
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={updating}
        onClick={() => (open ? setOpen(false) : openDropdown())}
        className={`flex items-center gap-1.5 border rounded-lg px-2 py-1.5 text-sm font-medium disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50 ${colors.bg} ${colors.text} ${colors.border}`}
      >
        {status}
        <FaChevronDown size={9} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: "fixed", top: position.top, left: position.left, minWidth: position.width }}
            className="z-50 rounded-lg border border-line-bright bg-bg-elevated shadow-lg shadow-black/40 overflow-hidden"
          >
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSelect(s)}
                className={`block w-full text-left px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors hover:bg-bg-elevated-2 ${
                  s === status ? STATUS_COLORS[s].text : "text-ink-soft"
                }`}
              >
                {s}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
