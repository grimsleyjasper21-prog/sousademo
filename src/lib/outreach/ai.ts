import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { GeneratedMessagesSchema, type GeneratedMessage, type RegenerateVariant } from "./types";
import type { Lead, Settings, LanguageMode } from "./types";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

export function isMockMode(): boolean {
  if (process.env.AI_MOCK_MODE === "true") return true;
  return !process.env.ANTHROPIC_API_KEY;
}

export interface GenerationLeadInput {
  lead_id: string;
  business_name: string;
  category: string | null;
  city: string | null;
  website: string | null;
  rating: number | null;
  review_count: number | null;
  booking_url: string | null;
  social_url: string | null;
  business_status: string | null;
}

export function toGenerationInput(lead: Lead): GenerationLeadInput {
  return {
    lead_id: lead.id,
    business_name: lead.business_name,
    category: lead.category,
    city: lead.city,
    website: lead.website,
    rating: lead.rating,
    review_count: lead.review_count,
    booking_url: lead.booking_url,
    social_url: lead.social_url,
    business_status: lead.business_status,
  };
}

export interface GenerateOptions {
  variant?: RegenerateVariant;
  languageOverride?: "es" | "en";
}

const BANNED_PHRASES = [
  "I hope this message finds you well",
  "elevate your online presence",
  "unlock your potential",
  "take your business to the next level",
  "revolutionize",
  "transform your digital presence",
  "we help businesses scale",
  "cutting-edge solutions",
  "bespoke digital solutions",
  "synergy",
  "leverage",
];

function languageInstruction(languageMode: LanguageMode, override?: "es" | "en"): string {
  if (override === "es") return "Write every message in natural Spain Spanish.";
  if (override === "en") return "Write every message in natural English.";
  if (languageMode === "es") return "Write every message in natural Spain Spanish.";
  if (languageMode === "en") return "Write every message in natural English.";
  return "For each business, decide Spanish or Spain Spanish by default. Only use English when the data clearly signals the business operates in English (e.g. an English-language website, an international/tourist-facing name, or English category text). Set \"language\" to \"es\" or \"en\" accordingly.";
}

function variantInstruction(variant?: RegenerateVariant): string {
  switch (variant) {
    case "more_casual":
      return "Rewrite this as a more casual, relaxed version than a typical first draft — still professional, just more informal in tone.";
    case "more_direct":
      return "Rewrite this as a more direct, shorter version that gets to the point faster.";
    case "try_again":
      return "Write a fresh alternative version with a different opening and structure than a typical first draft.";
    default:
      return "";
  }
}

function buildSystemPrompt(settings: Settings, options: GenerateOptions): string {
  return [
    "You write short WhatsApp outreach messages on behalf of a real person contacting business owners for GRIMHART, a digital agency.",
    "",
    `GRIMHART context: ${settings.ai_context}`,
    "",
    `Base instructions: ${settings.base_instructions}`,
    "",
    languageInstruction(settings.language_mode, options.languageOverride),
    "",
    "Style rules:",
    "- Sound like one person messaging another business owner, not automated software.",
    "- Confident, relaxed, professional, natural, short, conversational, low-pressure.",
    "- Target length: approximately 35-80 words. Shorter is generally better.",
    "- No emojis. No bullet points. No fake enthusiasm.",
    "- Never invent personalization: no fake compliments, no invented owner names, no invented services, no pretending to have visited the business or followed it for years.",
    "- Use only the truthful information provided about each business. If little data exists, keep personalization simple (e.g. mentioning the business type and city).",
    "- If a business has no website, consider mentioning helping create a proper online presence. If it appears to only have social media, consider mentioning a proper website/booking destination. If it already has a website or booking, do not criticize it — pitch a different relevant angle (multilingual experience, WhatsApp, reviews, menus, conversion, customer journey).",
    "- The goal is to start a conversation, not sell every service immediately. End with a low-friction call to action offering to show an idea or example — never ask for a sales call in this first message.",
    `- Never use these phrases or anything equivalent to them: ${BANNED_PHRASES.join("; ")}.`,
    "- Do not translate the business's own name.",
    "- Vary opening, structure, CTA and length naturally across different businesses so messages don't read as copy-pasted, but never force variation at the expense of quality.",
    options.variant ? `\nRegeneration instruction: ${variantInstruction(options.variant)}` : "",
    "\nYou will receive a JSON array of businesses. Call the return_messages tool exactly once with one entry per business, matched by lead_id. Do not depend on input order when producing output.",
  ]
    .filter(Boolean)
    .join("\n");
}

const RETURN_MESSAGES_TOOL: Anthropic.Tool = {
  name: "return_messages",
  description: "Return one generated outreach message per business, matched by lead_id.",
  input_schema: {
    type: "object",
    properties: {
      messages: {
        type: "array",
        items: {
          type: "object",
          properties: {
            lead_id: { type: "string" },
            language: { type: "string", enum: ["es", "en"] },
            message: { type: "string" },
          },
          required: ["lead_id", "language", "message"],
        },
      },
    },
    required: ["messages"],
  },
  strict: true,
};

export interface GenerationResult {
  succeeded: GeneratedMessage[];
  requestedIds: string[];
}

export async function generateMessages(
  leads: GenerationLeadInput[],
  settings: Settings,
  options: GenerateOptions = {}
): Promise<GenerationResult> {
  const requestedIds = leads.map((l) => l.lead_id);
  if (leads.length === 0) return { succeeded: [], requestedIds };

  if (isMockMode()) {
    return { succeeded: mockGenerate(leads, settings, options), requestedIds };
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const userContent = JSON.stringify(leads, null, 2);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: buildSystemPrompt(settings, options),
    tools: [RETURN_MESSAGES_TOOL],
    tool_choice: { type: "tool", name: "return_messages" },
    messages: [
      {
        role: "user",
        content: `Businesses:\n${userContent}`,
      },
    ],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) return { succeeded: [], requestedIds };

  const parsed = GeneratedMessagesSchema.safeParse(toolUse.input);
  if (!parsed.success) return { succeeded: [], requestedIds };

  // Only accept messages that correspond to a lead we actually asked about,
  // and never trust ordering.
  const requestedSet = new Set(requestedIds);
  const succeeded = parsed.data.messages.filter((m) => requestedSet.has(m.lead_id));

  return { succeeded, requestedIds };
}

// ---------------------------------------------------------------------------
// Development mock generator (AI_MOCK_MODE=true or no ANTHROPIC_API_KEY)
// ---------------------------------------------------------------------------

const ES_OPENERS = [
  "Hola, he encontrado vuestro negocio buscando {category} en {city}.",
  "Buenas, acabo de ver {business} en {city}.",
  "Hola, vi {business} mientras buscaba negocios en {city}.",
];

const ES_MIDDLES_NO_WEBSITE = [
  "Trabajo con GRIMHART, una agencia digital de Mallorca, y ayudamos a negocios como el vuestro a tener una presencia online sólida.",
  "Tengo una agencia digital y me especializo en crear webs y sistemas de reservas para negocios que todavía no tienen presencia online propia.",
];

const ES_MIDDLES_WITH_WEBSITE = [
  "Tengo una agencia digital (GRIMHART) y se me ocurrió una idea para mejorar la parte de reservas y la experiencia online.",
  "Trabajo con GRIMHART y vi una oportunidad para mejorar la experiencia online, sobre todo en la parte de idiomas y contacto por WhatsApp.",
];

const ES_CTAS = [
  "¿Te puedo enseñar rápidamente lo que tenía en mente?",
  "Si te interesa, te puedo mandar un ejemplo sin compromiso.",
  "Si quieres, te enseño la idea en dos minutos.",
];

const EN_OPENERS = [
  "Hi, I came across {business} while looking through places in {city}.",
  "Hi, I found your business while researching {category} in {city}.",
];

const EN_MIDDLES_NO_WEBSITE = [
  "I run GRIMHART, a digital agency based in Mallorca, and I help businesses like yours get a proper online presence.",
];

const EN_MIDDLES_WITH_WEBSITE = [
  "I run a digital agency (GRIMHART) and had an idea for improving the booking and online experience.",
];

const EN_CTAS = [
  "Would you like me to send over a quick example?",
  "Happy to show you what I had in mind if you're interested.",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function decideLanguage(lead: GenerationLeadInput, settings: Settings, override?: "es" | "en"): "es" | "en" {
  if (override) return override;
  if (settings.language_mode === "es" || settings.language_mode === "en") return settings.language_mode;
  const website = (lead.website || "").toLowerCase();
  if (website.includes(".co.uk") || website.includes(".com/en") || /\ben\b/.test(website)) return "en";
  return "es";
}

function mockGenerate(
  leads: GenerationLeadInput[],
  settings: Settings,
  options: GenerateOptions
): GeneratedMessage[] {
  return leads.map((lead) => {
    const seed = hashString(lead.lead_id + (options.variant ?? ""));
    const language = decideLanguage(lead, settings, options.languageOverride);
    const city = lead.city || "la zona";
    const category = (lead.category || "negocios").toLowerCase();
    const hasWebsite = Boolean(lead.website);

    let message: string;
    if (language === "es") {
      const opener = pick(ES_OPENERS, seed)
        .replace("{business}", lead.business_name)
        .replace("{city}", city)
        .replace("{category}", category);
      const middle = pick(hasWebsite ? ES_MIDDLES_WITH_WEBSITE : ES_MIDDLES_NO_WEBSITE, seed + 1);
      const cta = pick(ES_CTAS, seed + 2);
      message = `${opener} ${middle} ${cta}`;
    } else {
      const opener = pick(EN_OPENERS, seed)
        .replace("{business}", lead.business_name)
        .replace("{city}", city)
        .replace("{category}", category);
      const middle = pick(hasWebsite ? EN_MIDDLES_WITH_WEBSITE : EN_MIDDLES_NO_WEBSITE, seed + 1);
      const cta = pick(EN_CTAS, seed + 2);
      message = `${opener} ${middle} ${cta}`;
    }

    return { lead_id: lead.lead_id, language, message };
  });
}
