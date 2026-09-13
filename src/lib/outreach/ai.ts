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
    "You write short WhatsApp cold-outreach messages on behalf of a real person contacting business owners for GRIMHART, a digital agency. These get read by someone on their phone in the middle of running their business — the goal is to make them curious enough to reply, not to explain everything you do.",
    "",
    `GRIMHART context: ${settings.ai_context}`,
    "",
    `Base instructions: ${settings.base_instructions}`,
    "",
    languageInstruction(settings.language_mode, options.languageOverride),
    "",
    "ONE HOOK, NOT A PITCH:",
    "- Before writing, silently pick the single strongest true angle for this business from: no website, social-media-only presence, no visible booking system, otherwise a general improvement angle (multilingual site, WhatsApp booking, reviews, digital menu, conversion). Pick exactly one.",
    "- Build the entire message around that one angle. Never stack two or more selling points in the same message — that's what makes it read like a services list.",
    "- Don't fully explain the idea. Reference that one exists and let curiosity do the work — the reply is where the idea gets explained, not the first message.",
    "",
    "SOUND LIKE A PERSON TEXTING, NOT A COMPANY EMAILING:",
    "- Contractions, sentence fragments, imperfect casual phrasing. Real texts are not grammatically symmetric.",
    "- Mention GRIMHART / being a digital agency exactly once, briefly, in passing — never as a repeated signature line.",
    "- No fake enthusiasm, no exclamation-point stacking, no filler openers like 'espero que estés bien' or 'espero no molestar'.",
    "- No emojis. No bullet points or lists inside the message.",
    "",
    "BATCH-LEVEL VARIATION (this matters most — you are writing several messages at once):",
    "- No two messages in this batch may open with the same sentence structure. If one starts with an observation ('Vi que...'), another must start differently — a direct question, a short local reference, a comment tied to a real data point (rating/reviews), or something else entirely.",
    "- No two messages may end with the same closing question or CTA phrasing. Rotate between a question, an offer to show something, or a soft direct ask — vary the wording every time.",
    "- Vary length and rhythm too: some short and punchy, some slightly longer. Uniform length across a batch is itself a tell.",
    "",
    "TRUTHFULNESS:",
    "- Never invent personalization: no fake compliments, no invented owner names, no invented services, no pretending to have visited the business or followed it for years.",
    "- Use only the information actually provided about each business. If little data exists, keep it simple — just the business type and city is enough; don't force a fake specific detail.",
    "- If a business already has a website or booking, don't imply it's missing — pitch the different angle you picked instead.",
    "- Do not translate the business's own name.",
    "",
    "AVOID THESE AI TELLS (structure, not just word choice):",
    "- Symmetric clauses ('not only X but also Y'), restating what you just said, perfectly balanced sentences.",
    `- Never use these phrases or anything close to them: ${BANNED_PHRASES.join("; ")}.`,
    "- Target length: roughly 35-80 words. Shorter and rougher around the edges usually reads more human than longer and polished.",
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
