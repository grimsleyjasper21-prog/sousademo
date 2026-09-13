import { z } from "zod";

export const LEAD_STATUSES = [
  "uncontacted",
  "sent",
  "replied",
  "interested",
  "won",
  "lost",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type MessageLanguage = "es" | "en";

export type LanguageMode = "auto" | "es" | "en";

export interface Batch {
  id: string;
  name: string;
  created_at: string;
  is_active: boolean;
  total_leads: number;
}

export interface Lead {
  id: string;
  batch_id: string;
  import_order: number;
  business_name: string;
  phone: string | null;
  normalized_phone: string | null;
  website: string | null;
  category: string | null;
  city: string | null;
  full_address: string | null;
  rating: number | null;
  review_count: number | null;
  booking_url: string | null;
  social_url: string | null;
  whatsapp_url: string | null;
  google_maps_url: string | null;
  business_status: string | null;
  raw_data: Record<string, unknown>;
  status: LeadStatus;
  message: string | null;
  message_language: MessageLanguage | null;
  message_generated_at: string | null;
  contacted_at: string | null;
  created_at: string;
}

export interface Settings {
  id: string;
  daily_target: number;
  language_mode: LanguageMode;
  ai_context: string;
  base_instructions: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// AI generation contract
// ---------------------------------------------------------------------------

export const GeneratedMessageSchema = z.object({
  lead_id: z.string(),
  language: z.enum(["es", "en"]),
  message: z.string().min(1),
});

export const GeneratedMessagesSchema = z.object({
  messages: z.array(GeneratedMessageSchema),
});

export type GeneratedMessage = z.infer<typeof GeneratedMessageSchema>;

export type RegenerateVariant = "try_again" | "more_casual" | "more_direct";
