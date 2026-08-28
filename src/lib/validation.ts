import { z } from "zod";
import { STATUSES } from "./status";

// Validated once, at the API boundary — everything past this point in the
// app (Prisma calls, components) can trust the shape of the data instead
// of re-checking it at every layer.

export const createApplicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
});

export const updateApplicationSchema = z.object({
  status: z.enum(STATUSES).optional(),
  notes: z.string().optional(),
});
