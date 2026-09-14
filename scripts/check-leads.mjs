/**
 * Factual-integrity and completeness gate for every lead.
 *
 *   npm run check
 *
 * This is the rule from the brief made mechanical: a demo must never ship with
 * placeholder copy, an unsourced review, a missing route, or a design signature
 * recycled from the previous lead.
 */
import fs from "node:fs";
import path from "node:path";

const LEADS_DIR = "src/leads";
const APP_DIR = "src/app";

const problems = [];
const fail = (where, what) => problems.push(`${where}: ${what}`);

const PLACEHOLDERS = [
  "lorem ipsum",
  "example@example.com",
  "example.com",
  "123 main street",
  "john doe",
  "jane doe",
  "your business name",
  "todo:",
  "tbd",
  "xxx-xxx",
  "+34 600 000 000",
  "testimonial goes here",
];

const ledger = JSON.parse(fs.readFileSync(path.join(LEADS_DIR, "ledger.json"), "utf8"));
const ledgerBySlug = new Map(ledger.leads.map((l) => [l.slug, l]));

const slugs = fs
  .readdirSync(LEADS_DIR, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

if (slugs.length === 0) fail("factory", "no leads found in src/leads");

const signatures = new Map();

for (const slug of slugs) {
  const dir = path.join(LEADS_DIR, slug);
  const where = `lead "${slug}"`;

  for (const required of ["lead.ts", "design.ts", "fonts.ts"]) {
    if (!fs.existsSync(path.join(dir, required))) fail(where, `missing ${required}`);
  }

  const rawSource = fs
    .readdirSync(dir, { recursive: true })
    .filter((f) => typeof f === "string" && (f.endsWith(".ts") || f.endsWith(".tsx")))
    .map((f) => fs.readFileSync(path.join(dir, f), "utf8"))
    .join("\n");

  // Comments explain the rules; they shouldn't trip them.
  const source = rawSource
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

  const lower = source.toLowerCase();
  for (const bad of PLACEHOLDERS) {
    if (lower.includes(bad)) fail(where, `placeholder content: "${bad}"`);
  }

  // A review is only usable if it names who said it and where it was published.
  const reviewBlocks = source.match(/author:\s*"[^"]*"[\s\S]{0,400}?\}/g) ?? [];
  for (const block of reviewBlocks) {
    if (!/source:\s*"/.test(block)) fail(where, "a review has no source — remove it or attribute it");
  }

  // Unverified prices must be disclosed, never presented as the business's own.
  if (/pricing:\s*"indicative"/.test(source) && !/pricingNote/.test(source)) {
    fail(where, "indicative pricing without a pricingNote disclosure");
  }

  // Ledger coverage, and a visual signature that hasn't been used before.
  const record = ledgerBySlug.get(slug);
  if (!record) {
    fail(where, "no entry in src/leads/ledger.json");
  } else {
    const signature = record.designSignature;
    if (!signature) fail(where, "ledger entry has no designSignature");
    else if (signatures.has(signature)) {
      fail(where, `design signature already used by "${signatures.get(signature)}"`);
    } else signatures.set(signature, slug);
  }

  // Routes named in the lead's route map must actually exist.
  const routeMatch = source.match(/routes:\s*\{([\s\S]*?)\}/);
  const demoDir = path.join(APP_DIR, slug, "(demo)");
  if (!fs.existsSync(path.join(demoDir, "page.tsx"))) fail(where, `missing route ${demoDir}/page.tsx`);
  if (!fs.existsSync(path.join(APP_DIR, slug, "(proposal)", "propuesta", "page.tsx"))) {
    fail(where, "missing proposal route");
  }
  if (routeMatch) {
    for (const [, key, segment] of routeMatch[1].matchAll(/(\w+):\s*"([^"]+)"/g)) {
      if (!fs.existsSync(path.join(demoDir, segment, "page.tsx"))) {
        fail(where, `routes.${key} points at "${segment}" but ${demoDir}/${segment}/page.tsx does not exist`);
      }
    }
  }

  // A lead marked ready to send has to actually be sendable.
  if (record && record.status === "ready-to-send") {
    if (!/\bhero\b/.test(source)) fail(where, "marked ready-to-send but has no hero image");
    if (/tagline:\s*\{[^}]*"" *[,}]/.test(source)) fail(where, "marked ready-to-send with an empty tagline");
    for (const field of ["intro", "idea", "closing"]) {
      const re = new RegExp(`${field}:\\s*""`);
      if (re.test(source)) fail(where, `marked ready-to-send with an empty proposal.${field}`);
    }
    for (const field of ["noticed", "customerCan", "features"]) {
      const re = new RegExp(`${field}:\\s*\\[\\s*\\]`);
      if (re.test(source)) fail(where, `marked ready-to-send with an empty proposal.${field}`);
    }
    if (/services:\s*\[\s*\]/.test(source)) fail(where, "marked ready-to-send with no services");
    if (/verified:\s*false/.test(source)) {
      fail(where, "marked ready-to-send with unverified opening hours");
    }
  }

  // The manifest promises these icons.
  const icons = path.join("public", "leads", slug, "icons");
  for (const file of ["icon-192.png", "icon-512.png", "icon-maskable-192.png", "icon-maskable-512.png", "favicon-32.png"]) {
    if (!fs.existsSync(path.join(icons, file))) fail(where, `missing icon ${path.join(icons, file)}`);
  }
}

for (const record of ledger.leads) {
  if (!slugs.includes(record.slug)) fail(`ledger "${record.slug}"`, "no matching folder in src/leads");
}

if (problems.length === 0) {
  console.log(`Checked ${slugs.length} lead(s). All clear.`);
} else {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(` - ${p}`);
  process.exitCode = 1;
}
