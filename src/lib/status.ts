export const STATUSES = ["APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED"] as const;
export type Status = (typeof STATUSES)[number];

// One color per status, reused everywhere status is rendered (stat cards,
// the dropdown) so a status always looks the same no matter where it shows up.
// Dark-tinted backgrounds + bright text, keeping the same semantic colors
// (green = good, red = bad) a status pipeline needs regardless of theme.
export const STATUS_COLORS: Record<
  Status,
  { bg: string; text: string; border: string }
> = {
  APPLIED: { bg: "bg-slate-500/10", text: "text-slate-300", border: "border-slate-500/30" },
  OA: { bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/30" },
  INTERVIEW: { bg: "bg-violet-500/10", text: "text-violet-300", border: "border-violet-500/30" },
  OFFER: { bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/30" },
  REJECTED: { bg: "bg-rose-500/10", text: "text-rose-300", border: "border-rose-500/30" },
};
