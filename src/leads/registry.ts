import type { Lead } from "@/factory/types";
import { sousa } from "./sousa/lead";

/**
 * Every lead the factory has built. Data only — no fonts, no components — so
 * importing this from an API route or a script stays cheap.
 */
export const leads: Lead[] = [sousa];

export function leadBySlug(slug: string): Lead | undefined {
  return leads.find((l) => l.slug === slug);
}
