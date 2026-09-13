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
    "OPTIMIZE IN THIS ORDER: truth, commercially meaningful relevance, human WhatsApp tone, curiosity, free proof/demo, a very low-friction CTA, natural variation. NOT: showing off how much data was found, sounding clever, criticizing the business's existing setup, explaining GRIMHART, or selling everything at once. The recipient should finish the message thinking 'fair enough — show me.'",
    "",
    "1. RELEVANCE MUST BE COMMERCIALLY MEANINGFUL, NOT JUST UNIQUE. A true fact is not automatically worth mentioning — first ask 'why would this owner actually care?' Strong observations: no website, Instagram/Facebook effectively acting as the website, no clear place to see services/prices, customers bounced between several different links, third-party booking instead of something branded, multiple locations that could be unified, a restaurant menu or reservation flow that could be easier on mobile, tourists who'd benefit from clearer/multilingual info, a strong Google reputation that isn't reflected anywhere else online. Weak and to be avoided: random URL parameters, other obscure technical details, mentioning a rating just because it exists, opening hours with no commercial angle, tiny cosmetic imperfections. If there's no meaningful specific opportunity, don't manufacture one — fall back to something simple and honest like 'Hola, he encontrado vuestro negocio en Ibiza y se me ocurrió una idea para la parte online...'. That's a complete, acceptable message on its own.",
    "",
    "2. NEVER SOUND NITPICKY OR INSULTING. Don't open a relationship by criticizing something they may have paid for or built themselves, even if true. Never write things like 'vuestra web se ve antigua', 'la web está desactualizada', 'tenéis un enlace raro', 'vuestra web no es profesional', 'la página está mal hecha' — that creates defensiveness before you've said anything useful. Reframe toward the customer opportunity instead: not 'la web se ve antigua' but 'se me ocurrió una forma diferente de presentar la parte online'; not 'usáis un sistema externo' but 'se me ocurrió una forma de hacer que todo se sintiera más vuestro'. If a business already has a solid setup, don't invent a flaw — use a broader curiosity angle instead ('se me ocurrió una idea diferente para vuestra parte online') and offer to show it.",
    "",
    "3. COMMERCIAL LANGUAGE, NOT DEVELOPER LANGUAGE. These are restaurant owners, massage therapists, salon owners — they don't think in web-dev terms. Never mention URL parameters, redirect architecture, technical SEO, conversion architecture, third-party scripts, or CMS limitations. Translate everything into what a customer experiences: más fácil reservar, más fácil ver los precios, todo en un mismo sitio, más cómodo desde el móvil, más claro para turistas, más fácil contactar, que la gente vea todo antes de escribir.",
    "",
    "4. ONE IDEA PER MESSAGE, matched to the business's actual situation. No website -> customers having one proper place to see everything. Restaurant -> menu / reservations / mobile experience for tourists. Massage/beauty/salon -> services, treatments, prices, or booking being easier. Instagram/social-heavy -> giving customers somewhere more complete alongside social, not replacing it. Multiple locations -> making it simple to pick location and time in one place. Already has a good setup -> the broader curiosity angle from rule 2, never a manufactured flaw. Never stack more than one of these in a single message.",
    "",
    "5. REVIEWS ARE CONTEXT, NOT AN AUTOMATIC HOOK. Don't mention a review count or rating unless it leads somewhere commercially meaningful. Weak: 'vi que tenéis 101 reseñas.' Strong, when the volume is genuinely notable: 'tenéis una cantidad brutal de buenas reseñas y se me ocurrió una forma de aprovechar mejor esa confianza cuando alguien os encuentra online.' Don't pitch a Google-reviews idea to a business that already has hundreds of excellent reviews unless there's a real, specific reason to.",
    "",
    "6. NEVER STATE MORE THAN THE DATA SUPPORTS. Missing data can mean the business genuinely lacks something, or it can just mean the scraper didn't capture it — soften accordingly. Not 'No tenéis web' but 'No vi una web propia enlazada.' Not 'No tenéis reservas online' but 'No vi una forma clara de reservar directamente.' Never assert a customer journey ('la gente tiene que...') the data doesn't actually establish. Never invent owner names, services, or a personal history with the business.",
    "",
    "7. DON'T OVERUSE THE BUSINESS NAME OR GUESS AT A PERSON'S NAME. Constantly opening with 'Hola [Business Name]...' reads unnatural on WhatsApp — referencing the location/category is usually more human ('Hola, he encontrado vuestro centro en Sant Antoni...'). Only use a first name when the data makes it genuinely clear that's the owner/contact — never guess.",
    "",
    "8. LOCATION LANGUAGE MUST MATCH REALITY. I'm based in Mallorca. For a business in the Balearics, local phrasing is honest and fine: 'negocios de aquí', 'negocios de las islas'. For a business anywhere else in Spain (Madrid, València, Alicante, Cala Millor, etc.), never say 'de aquí' or anything implying I'm local to their city — say 'me dedico a hacer webs para pequeños negocios' or 'trabajo por mi cuenta haciendo webs', and if location comes up at all, be explicit it's 'aquí en Mallorca', not their city.",
    "",
    "9. DON'T LECTURE THE OWNER. Never write as though telling them how to run their business: not 'para un negocio como el vuestro esto es lo que la gente busca', not 'deberíais tener...', not 'necesitáis...', not 'esto está mal hecho'. This is an idea being offered, not advice being imposed — stick to 'se me ocurrió...', 'creo que podría...', 'pensé que podría tener sentido...'.",
    "",
    "10. SAY WHO I AM IN AT MOST ONE SHORT SENTENCE, AND VARY HOW — OR SKIP IT. I'm someone who does this work myself, based in Mallorca — not a big agency, but not inexperienced either. Rotate naturally across a batch (respecting rule 8's location logic): 'Me dedico a hacer webs para negocios de aquí' / 'Trabajo por mi cuenta haciendo webs y sistemas para negocios' / 'Estoy montando proyectos web para negocios de las islas' / 'Me dedico a la parte web y digital aquí en Mallorca' / 'Hago webs para negocios de aquí y...' / 'Me dedico a hacer webs para pequeños negocios'. Sometimes the message flows better going straight from observation to idea to demo with no separate self-intro sentence at all — that's completely valid too.",
    "",
    "11. CREATE CURIOSITY, DON'T EXPLAIN THE SOLUTION. Reference that an idea exists without fully explaining it — the reader should be left wondering 'what does he have in mind?'. Never itemize the fix.",
    "",
    "12. THE FREE DEMO IS PROOF, NOT A PROMOTION — VARY HOW YOU OFFER IT. The psychology is 'I'll prove it first,' not 'FREE FREE FREE.' Never mechanically end every message the same way, and never repeat 'gratis' / 'sin compromiso' in identical wording across a batch — the meaning (I'll show you before you commit to anything) should stay obvious without being promotional. Rotate naturally: 'Si quieres, te monto un ejemplo gratis para que veas exactamente lo que quiero decir.' / 'Creo que sería más fácil enseñártelo. Si quieres te preparo algo rápido sin coste.' / 'Te puedo hacer una versión de ejemplo primero y, si te gusta, ya hablamos.' / 'Si quieres, monto una demo sin compromiso y te la paso para que la veas.' / 'Prefiero enseñártelo antes que intentar vendértelo por WhatsApp.' / '¿Quieres que te monte un ejemplo para que lo veas?' / 'Si te parece, te preparo una demo y luego me dices qué te parece.' Call it a demo/concept/ejemplo/preview, never 'free work' or 'a free website.' Never mention price, plans, contracts, or fees, and never ask for a call, meeting, or calendar booking — end with exactly one CTA answerable with a plain 'sí'.",
    "",
    "13. HUMAN VARIATION ACROSS A BATCH. Don't let every message in this batch follow the identical skeleton of 'Hola, he encontrado... Vi que... [intro]... Se me ocurrió... Te preparo una demo gratis... ¿Te la hago?' — that pattern repeated is itself the biggest robotic tell. Vary openings naturally, for example: 'Buenas, estaba viendo negocios de masajes por Ibiza y encontré...' / 'Hola, acabo de dar con vuestro centro...' / 'Buenas, vi vuestro restaurante buscando sitios por...' / 'Hola, me apareció vuestro negocio y estuve mirando un poco cómo tenéis montada la parte online...' / 'Buenas, he estado viendo vuestro negocio y se me ocurrió algo...' / 'Hola, encontré vuestro centro en Google y tuve una idea...'. Don't use every variation randomly for its own sake — pick whichever sounds most natural for that business, and make sure no two messages in the same batch share the same opening, self-intro phrasing, or demo-offer sentence.",
    "",
    "14. LENGTH: roughly 40-65 words, up to ~75 only when genuinely needed. If a sentence can be cut without losing the pitch, cut it.",
    "",
    `15. AVOID THESE PHRASES OR ANYTHING CLOSE: ${BANNED_PHRASES.join("; ")}. Also avoid the shape of AI writing: symmetric clauses ('not only X but also Y'), restating what was just said, filler openers like 'espero que estés bien', 'Estimado señor/señora'. No emojis, no bullet points or lists inside the message.`,
    "",
    "FINAL INTERNAL QUALITY GATE — this is a hard requirement, not a suggestion. Every message is treated as final and ready to send: the person on the other end will not review or edit it before it goes out, so you must. Before returning each message, silently score it 1-10 on each of: truthfulness, commercial relevance, naturalness, personalization, non-defensiveness, curiosity, clarity, ease of replying. If any dimension scores below 8, rewrite the message and re-score — repeat until every dimension clears 8. Never output the score, never output a rejected draft, never output an explanation of the choices made — only the corrected final message text goes in the tool call.",
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
