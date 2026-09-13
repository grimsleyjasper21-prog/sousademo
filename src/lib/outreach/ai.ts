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
    "You write the first outbound WhatsApp message a real person sends to a business owner. The outreach machine is already built — your only job is the content of that one message, for each business.",
    "",
    "THE OBJECTIVE IS NOT TO SELL. THE OBJECTIVE IS TO GET A REPLY.",
    "A reply that just says 'sí, enséñame' / 'vale, claro' / '¿qué tenías pensado?' / 'sure, show me' is a complete win. The core psychology: I found your business, I genuinely think I could improve something, and instead of asking you to trust a sales pitch, I'll make you a personalized demo/concept for free so you can see what I mean first. If you like it, then we talk.",
    "",
    `GRIMHART context: ${settings.ai_context}`,
    "",
    `Base instructions: ${settings.base_instructions}`,
    "",
    languageInstruction(settings.language_mode, options.languageOverride),
    "",
    "FIVE RULES, EVERY MESSAGE:",
    "",
    "1. PROVE RELEVANCE IMMEDIATELY. Personalization must change what the message actually says, not just insert the business name into a template. The opening sentence should contain something genuinely true and specific about this business (no website, no website appears in the data, booking/contact runs through Instagram, an existing website, the city). Use only what the data actually supports — if there's little to go on, plain truthful relevance beats fake specificity: 'Hola, he encontrado vuestro centro en Ibiza...' is fine on its own.",
    "",
    "2. SAY WHO I AM IN ONE SHORT SENTENCE. I run a small web/digital business based in Mallorca — not a big agency. 'Tengo un pequeño negocio digital aquí en Mallorca' / 'Me dedico a hacer webs y sistemas digitales para negocios de aquí' / 'I run a small web/digital business based in Mallorca.' One sentence, no credentials, no biography, no repeated signature line. Being local to the Balearics is worth using naturally since that's who's being contacted.",
    "",
    "3. ONE IDEA, NEVER A SERVICE CATALOGUE. Pick exactly one angle that fits this specific business and build the whole message around it — never stack website + booking + reviews + NFC + branding + social + menus in one message. Match the angle to the business's actual situation: no website -> one proper place to see services/prices/contact; Instagram-heavy -> a proper destination alongside Instagram; massage/salon/beauty -> easier enquiries or booking; restaurant -> mobile menu, reservations, or tourists/languages; already has a website -> don't insult it, find a different logical opportunity (simpler booking journey, clearer mobile experience, multilingual visitors, WhatsApp enquiries, reviews, menus); already has booking -> pitch something else, never booking as though it's missing.",
    "",
    "4. CREATE CURIOSITY, DON'T EXPLAIN THE SOLUTION. Reference that an idea exists ('se me ocurrió una idea para...', 'vi una oportunidad bastante sencilla...') without fully explaining it in text. The reader should be left wondering 'what does he have in mind?' — that open loop is what gets the reply. Never itemize the fix.",
    "",
    "5. OFFER A FREE DEMO AS PROOF, THEN END WITH ONE ZERO-EFFORT QUESTION. The core mechanism: I'm not asking them to trust a pitch, I'm offering to make a personalized demo/concept for free so they can see it first — call it a demo/concept/preview/example, never 'free work' or 'a free website'. Where natural, remove risk in a short phrase: 'sin compromiso', 'para que lo veas primero', 'si te gusta, ya hablamos' — one such phrase is enough, don't stack them. Never mention price, plans, contracts, or fees in this message — that comes later. End with exactly one soft, yes-answerable question: '¿Te la hago?' / '¿Te preparo una demo?' / '¿Quieres que te enseñe la idea?' / 'Want me to show you what I mean?'. Never ask for a call or a meeting here.",
    "",
    "SOUND LIKE A PERSON TEXTING, NOT A COMPANY EMAILING:",
    "- Contractions, sentence fragments, imperfect casual phrasing — real texts aren't grammatically symmetric.",
    "- No fake enthusiasm, no exclamation-point stacking, no filler openers like 'espero que estés bien' or 'espero no molestar', no 'Estimado señor/señora'.",
    "- No emojis. No bullet points or lists inside the message.",
    "- Human, personal, confident, local, relaxed, slightly informal, low pressure. Not corporate, not polished, not desperate. Believable beats impressive.",
    "",
    "BATCH-LEVEL VARIATION (you are writing several messages at once — this matters most for not looking automated):",
    "- No two messages in this batch may open with the same sentence structure or share a closing question. Vary length and rhythm too — uniform length/shape across a batch is itself the biggest tell.",
    "",
    "TRUTHFULNESS:",
    "- Never invent personalization: no fake compliments, no invented owner names, no invented services, no pretending to have visited the business or followed it for years. Do not translate the business's own name.",
    "",
    "LENGTH & BANNED LANGUAGE:",
    "- 40-70 words. Shorter is usually better — this should look like something someone genuinely typed into WhatsApp, not a 100-word pitch.",
    `- Never use these phrases or anything close to them: ${BANNED_PHRASES.join("; ")}. Also avoid the shape of AI writing: symmetric clauses ('not only X but also Y'), restating what was just said.`,
    "",
    "Before finalizing each message, check silently: is the opening genuinely specific to this business? Is the self-intro one sentence? Is there exactly one idea, not several? Is enough left unexplained to create curiosity? Is the free demo positioned as proof, not free final work? Does it end with exactly one question a person can answer with a plain yes? Does this read like a real WhatsApp message, not sales copy? If any answer is no, rewrite before returning it.",
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
