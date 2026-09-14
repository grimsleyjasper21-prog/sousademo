/**
 * Prints the internal lead ledger with the links to send.
 *
 *   npm run leads
 *   SITE_ORIGIN=https://grimhartdemo.com npm run leads
 */
import fs from "node:fs";

const ledger = JSON.parse(fs.readFileSync("src/leads/ledger.json", "utf8"));
const origin = (process.env.SITE_ORIGIN || process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000").replace(/\/$/, "");

console.log(`\nGRIMHART leads — ${ledger.leads.length} built\n`);

for (const lead of ledger.leads) {
  console.log(`${lead.business}`);
  console.log(`  slug        ${lead.slug}   (${lead.vertical}, ${lead.location})`);
  console.log(`  built       ${lead.built}   ·   status: ${lead.status}`);
  console.log(`  languages   ${lead.languages.join(" / ")}`);
  console.log(`  booking     ${lead.bookingMode}   ·   pricing: ${lead.pricing}`);
  console.log(`  signature   ${lead.designSignature}`);
  console.log(`  demo        ${origin}/${lead.slug}`);
  console.log(`  proposal    ${origin}/${lead.slug}/propuesta`);
  if (lead.notes) console.log(`  notes       ${lead.notes}`);
  console.log("");
}
