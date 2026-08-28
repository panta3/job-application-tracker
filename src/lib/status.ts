export const STATUSES = ["APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED"] as const;
export type Status = (typeof STATUSES)[number];

// One color per status, reused everywhere status is rendered (stat cards,
// the dropdown) so a status always looks the same no matter where it shows up.
export const STATUS_COLORS: Record<
  Status,
  { bg: string; text: string; border: string }
> = {
  APPLIED: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300" },
  OA: { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  INTERVIEW: { bg: "bg-violet-100", text: "text-violet-800", border: "border-violet-300" },
  OFFER: { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
  REJECTED: { bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-300" },
};
