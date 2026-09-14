/**
 * Scaffolds a new lead: data files, routes, ledger entry, registry wiring.
 *
 *   node scripts/new-lead.mjs \
 *     --slug natalia --name "Natalia Masajes" --short Natalia \
 *     --vertical massage --preset bone-editorial \
 *     --locality "Palma de Mallorca" --address "Carrer Example, 1" \
 *     --phone "+34600000000" [--locales es,en] [--region "Illes Balears"]
 *
 * It writes the boring parts — folders, wiring, route files, tokens. The art
 * direction, copy, services and imagery are still yours: open
 * src/leads/<slug>/ and fill them in.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const slug = flag("slug");
const name = flag("name");
if (!slug || !name) {
  console.error("Required: --slug <slug> --name \"<Business Name>\"");
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error("Slug must be lowercase letters, numbers and hyphens only.");
  process.exit(1);
}

const shortName = flag("short", name.split(/[\s—-]/)[0]);
const vertical = flag("vertical", "services");
const locality = flag("locality", "Palma de Mallorca");
const region = flag("region", "Illes Balears");
const address = flag("address", "");
const phone = flag("phone", "");
const locales = flag("locales", "es,en").split(",").map((l) => l.trim());
const presetId = flag("preset", "bone-editorial");

const presets = JSON.parse(fs.readFileSync("src/factory/design/presets.json", "utf8")).presets;
const preset = presets.find((p) => p.id === presetId);
if (!preset) {
  console.error(`Unknown preset "${presetId}". Available: ${presets.map((p) => p.id).join(", ")}`);
  process.exit(1);
}

const leadDir = path.join("src/leads", slug);
if (fs.existsSync(leadDir)) {
  console.error(`src/leads/${slug} already exists.`);
  process.exit(1);
}

const routes = { services: "servicios", booking: "reservar", location: "donde-estamos", contact: "contacto" };
if (locales[0] === "en") {
  Object.assign(routes, { services: "services", booking: "book", location: "find-us", contact: "contact" });
}

const write = (file, contents) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
  console.log(`  ${file}`);
};

const q = (s) => JSON.stringify(s);

console.log(`\nScaffolding ${name} (${slug}) with the "${preset.id}" preset:\n`);

/* ---------------------------------------------------------------- data */

const fontVar = (kind) => `--${slug}-${kind}`;
write(
  path.join(leadDir, "fonts.ts"),
  `import { ${preset.googleFonts.display}, ${preset.googleFonts.body} } from "next/font/google";

/** ${name}'s typefaces. Declared here so only this demo's routes download them. */
const display = ${preset.googleFonts.display}({
  variable: "${fontVar("display")}",
  subsets: ["latin"],
  display: "swap",
});

const body = ${preset.googleFonts.body}({
  variable: "${fontVar("body")}",
  subsets: ["latin"],
  display: "swap",
});

export const ${slug.replace(/-/g, "")}FontClass = \`\${display.variable} \${body.variable}\`;

export const ${slug.replace(/-/g, "")}FontStacks = {
  display: 'var(${fontVar("display")}), ${preset.fontStacks.display.replace(/"/g, '\\"')}',
  body: 'var(${fontVar("body")}), ${preset.fontStacks.body.replace(/"/g, '\\"')}',
};
`
);

const camel = slug.replace(/-/g, "");
write(
  path.join(leadDir, "design.ts"),
  `import type { DesignProfile } from "@/factory/types";
import { ${camel}FontStacks } from "./fonts";

/**
 * Started from the "${preset.id}" preset — ${preset.for}
 * Change it. Two demos that share a signature look like recolours of each other.
 */
export const ${camel}Design: DesignProfile = {
  mode: ${q(preset.mode)},
  palette: ${JSON.stringify(preset.palette, null, 4).replace(/\n/g, "\n  ")},
  fonts: { display: ${camel}FontStacks.display, body: ${camel}FontStacks.body },
  typeScale: ${q(preset.typeScale)},
  radius: ${q(preset.radius)},
  buttons: ${q(preset.buttons)},
  rhythm: ${q(preset.rhythm)},
  motion: ${q(preset.motion)},
  imageTreatment: ${q(preset.imageTreatment)},
  eyebrowStyle: ${q(preset.eyebrowStyle)},
  variants: ${JSON.stringify(preset.variants, null, 4).replace(/\n/g, "\n  ")},
  sectionOrder: ["hero", "statement", "services", "about", "booking", "reviews", "location", "cta"],
  signature: "${preset.id} · ${preset.googleFonts.display.toLowerCase()}/${preset.googleFonts.body.toLowerCase()} · ${preset.variants.hero} · ${preset.variants.services}",
};
`
);

write(
  path.join(leadDir, "images.ts"),
  `import type { ImageRef } from "@/factory/types";

/**
 * ${name}'s imagery.
 *
 * Priority: the business's own public photographs, then anything Jasper supplies,
 * then high-quality stock. Set \`origin\` honestly — it is what keeps alt text and
 * captions from claiming a stock photo shows these premises.
 *
 * The sections look for: hero, heroAlt, about, cta, location.
 */
export const ${camel}Images: Record<string, ImageRef> = {};
`
);

write(
  path.join(leadDir, "services.ts"),
  `import type { Catalogue } from "@/factory/types";

/**
 * ${name}'s menu.
 *
 * pricing: "verified"   — these are the business's own published prices.
 * pricing: "indicative" — realistic stand-ins; the UI discloses it automatically.
 * pricing: "onRequest"  — no prices shown at all.
 */
export const ${camel}Catalogue: Catalogue = {
  pricing: "onRequest",
  categories: [],
  services: [],
};
`
);

write(
  path.join(leadDir, "lead.ts"),
  `import type { Lead } from "@/factory/types";
import { ${camel}Catalogue } from "./services";
import { ${camel}Design } from "./design";
import { ${camel}Images } from "./images";

/**
 * ${name} — ${locality}.
 * Everything here must be verifiable. If a fact cannot be checked, leave it out
 * and design around the gap.
 */
export const ${camel}: Lead = {
  slug: ${q(slug)},
  vertical: ${q(vertical)},
  business: {
    name: ${q(name)},
    shortName: ${q(shortName)},
    tagline: { ${locales.map((l) => `${l}: ""`).join(", ")} },
  },
  locales: [${locales.map(q).join(", ")}],
  defaultLocale: ${q(locales[0])},
  routes: ${JSON.stringify(routes, null, 4).replace(/\n/g, "\n  ")},
  contact: {
    ${phone ? `phoneE164: ${q(phone)},\n    whatsappE164: ${q(phone)},` : "// phoneE164 / whatsappE164 once verified"}
  },
  location: {
    addressLines: [${address ? q(address) : ""}],
    locality: ${q(locality)},
    region: ${q(region)},
    countryCode: "ES",
    mapsQuery: ${q(`${name}, ${address ? `${address}, ` : ""}${locality}`)},
  },
  hours: {
    verified: false,
    timezone: "Europe/Madrid",
    week: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
  },
  catalogue: ${camel}Catalogue,
  reputation: { reviews: [] },
  booking: {
    enabled: true,
    mode: "demo",
    calendarRef: ${q(slug.toUpperCase().replace(/-/g, "_"))},
    eventPrefix: ${q(`[${shortName.toUpperCase()} DEMO]`)},
    slotStepMin: 15,
    bufferMin: 0,
    leadTimeMin: 60,
    horizonDays: 90,
    requireEmail: false,
    whatsappFallback: true,
  },
  design: ${camel}Design,
  copy: {
    cta: { title: { ${locales.map((l) => `${l}: ""`).join(", ")} } },
  },
  images: ${camel}Images,
  meta: {
    description: { ${locales.map((l) => `${l}: ""`).join(", ")} },
    demoDisclosure: true,
  },
  proposal: {
    locale: ${q(locales[0])},
    intro: "",
    noticed: [],
    idea: "",
    customerCan: [],
    features: [],
    showAppUpsell: true,
    closing: "",
    ctaLabel: ${locales[0] === "en" ? q("I'm interested") : q("Me interesa")},
    whatsappMessage: ${q(`Hola Jasper, he visto la demo de ${shortName} y me interesa.`)},
  },
};
`
);

/* ---------------------------------------------------------------- routes */

const appDir = path.join("src/app", slug);
write(
  path.join(appDir, "(demo)", "layout.tsx"),
  `import type { Metadata, Viewport } from "next";
import LeadShell from "@/factory/pages/LeadShell";
import { ${camel}FontClass } from "@/leads/${slug}/fonts";
import { ${camel} } from "@/leads/${slug}/lead";

export const metadata: Metadata = {
  manifest: "/${slug}/manifest.webmanifest",
  icons: {
    icon: "/leads/${slug}/icons/favicon-32.png",
    apple: "/leads/${slug}/icons/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: ${q(shortName)} },
};

export const viewport: Viewport = {
  themeColor: ${camel}.design.palette.ink,
  colorScheme: ${q(preset.mode)},
};

export default function Layout({ children }: LayoutProps<"/${slug}">) {
  return (
    <div className={${camel}FontClass}>
      <LeadShell lead={${camel}}>{children}</LeadShell>
    </div>
  );
}
`
);

write(
  path.join(appDir, "(demo)", "page.tsx"),
  `import HomePage from "@/factory/pages/HomePage";
import { buildMetadata } from "@/factory/seo/metadata";
import { ${camel} } from "@/leads/${slug}/lead";

export const metadata = buildMetadata(${camel}, { path: "/${slug}" });

export default function Page() {
  return <HomePage lead={${camel}} />;
}
`
);

const pageFor = (component, extra = "") =>
  `import ${component} from "@/factory/pages/${component}";
import { buildMetadata } from "@/factory/seo/metadata";
import { ${camel} } from "@/leads/${slug}/lead";

export const metadata = buildMetadata(${camel}, { path: "/${slug}/${extra}" });

export default function Page() {
  return <${component} />;
}
`;

write(path.join(appDir, "(demo)", routes.services, "page.tsx"), pageFor("ServicesPage", routes.services));
write(path.join(appDir, "(demo)", routes.location, "page.tsx"), pageFor("LocationPage", routes.location));
write(path.join(appDir, "(demo)", routes.contact, "page.tsx"), pageFor("ContactPage", routes.contact));

write(
  path.join(appDir, "(demo)", routes.booking, "page.tsx"),
  `import BookingPage from "@/factory/pages/BookingPage";
import { buildMetadata } from "@/factory/seo/metadata";
import { ${camel} } from "@/leads/${slug}/lead";

export const metadata = buildMetadata(${camel}, { path: "/${slug}/${routes.booking}" });

export default async function Page(props: PageProps<"/${slug}/${routes.booking}">) {
  const { s } = await props.searchParams;
  return <BookingPage initialServiceId={typeof s === "string" ? s : undefined} />;
}
`
);

write(
  path.join(appDir, "(demo)", routes.services, "[servicio]", "page.tsx"),
  `import { notFound } from "next/navigation";
import ServicePage from "@/factory/pages/ServicePage";
import { findService } from "@/factory/format";
import { text } from "@/factory/locale";
import { buildMetadata } from "@/factory/seo/metadata";
import { ${camel} } from "@/leads/${slug}/lead";

export function generateStaticParams() {
  return ${camel}.catalogue.services.map((service) => ({ servicio: service.id }));
}

export async function generateMetadata(props: PageProps<"/${slug}/${routes.services}/[servicio]">) {
  const { servicio } = await props.params;
  const service = findService(${camel}.catalogue.services, servicio);
  if (!service) return buildMetadata(${camel}, { path: "/${slug}/${routes.services}" });
  return buildMetadata(${camel}, {
    path: \`/${slug}/${routes.services}/\${service.id}\`,
    title: text(service.name, ${camel}.defaultLocale, ${camel}.defaultLocale),
    description: text(service.short, ${camel}.defaultLocale, ${camel}.defaultLocale) || undefined,
    image: service.image?.url,
  });
}

export default async function Page(props: PageProps<"/${slug}/${routes.services}/[servicio]">) {
  const { servicio } = await props.params;
  const service = findService(${camel}.catalogue.services, servicio);
  if (!service) notFound();
  return <ServicePage service={service} />;
}
`
);

write(
  path.join(appDir, "(demo)", "app", "page.tsx"),
  `import AppPage from "@/factory/pages/AppPage";
import { buildMetadata } from "@/factory/seo/metadata";
import { ${camel} } from "@/leads/${slug}/lead";

export const metadata = buildMetadata(${camel}, { path: "/${slug}/app", title: "App" });

export default function Page() {
  return <AppPage />;
}
`
);

write(
  path.join(appDir, "(proposal)", "propuesta", "page.tsx"),
  `import type { Metadata } from "next";
import ProposalPage from "@/factory/proposal/ProposalPage";
import { grimhartFontClass } from "@/factory/proposal/fonts";
import { ${camel} } from "@/leads/${slug}/lead";

export const metadata: Metadata = {
  title: \`Propuesta · \${${camel}.business.name} · GRIMHART\`,
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={grimhartFontClass}>
      <ProposalPage lead={${camel}} />
    </div>
  );
}
`
);

write(
  path.join(appDir, "manifest.webmanifest", "route.ts"),
  `import { buildManifest } from "@/factory/pwa/manifest";
import { ${camel} } from "@/leads/${slug}/lead";

export function GET() {
  return Response.json(buildManifest(${camel}), {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
`
);

/* ---------------------------------------------------------------- wiring */

const registryPath = "src/leads/registry.ts";
let registry = fs.readFileSync(registryPath, "utf8");
registry = registry.replace(
  /(import type \{ Lead \} from "@\/factory\/types";\n)/,
  `$1import { ${camel} } from "./${slug}/lead";\n`
);
registry = registry.replace(/export const leads: Lead\[\] = \[([^\]]*)\];/, (_, list) => {
  const existing = list.trim().replace(/,$/, "");
  return `export const leads: Lead[] = [${existing ? `${existing}, ` : ""}${camel}];`;
});
fs.writeFileSync(registryPath, registry);
console.log(`  ${registryPath} (updated)`);

const ledgerPath = "src/leads/ledger.json";
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
ledger.leads.push({
  slug,
  business: name,
  vertical,
  location: locality,
  built: new Date().toISOString().slice(0, 10),
  languages: locales,
  designSignature: `${preset.id} · ${preset.googleFonts.display.toLowerCase()}/${preset.googleFonts.body.toLowerCase()} · ${preset.variants.hero} · ${preset.variants.services}`,
  bookingMode: "demo",
  pricing: "onRequest",
  status: "in-progress",
  notes: "",
});
fs.writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);
console.log(`  ${ledgerPath} (updated)`);

console.log(`
Next:
  1. Research the business and fill in src/leads/${slug}/lead.ts — hours, address, contact, reputation.
  2. Fill src/leads/${slug}/services.ts with the real menu, then set catalogue.pricing.
  3. Add imagery to src/leads/${slug}/images.ts (keys: hero, heroAlt, about, cta, location).
  4. Change the design in src/leads/${slug}/design.ts — the preset is a starting point, not the answer.
  5. Write the proposal block at the bottom of lead.ts.
  6. node scripts/icons.mjs --lead ${slug} --text "${shortName}" --bg "${preset.palette.ink}" --fg "${preset.palette.text}"
  7. npm run check && npm run build
  8. npm run start, then: node scripts/shots.mjs --lead ${slug} && node scripts/qa.mjs
`);
