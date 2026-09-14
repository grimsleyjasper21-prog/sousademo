/**
 * Screenshots for the proposals (and for sending to a prospect).
 *
 *   node scripts/shots.mjs --lead sousa [--base http://localhost:3000]
 *
 * Writes public/proposals/<slug>/desktop.png and mobile.png, which the proposal
 * page picks up automatically. Run it against a running production server.
 */
import fs from "node:fs/promises";
import path from "node:path";

const pw = (await import("/opt/node22/lib/node_modules/playwright/index.js")).default;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const BASE = flag("base", "http://localhost:3000").replace(/\/$/, "");
const slug = flag("lead");
if (!slug) {
  console.error("Usage: node scripts/shots.mjs --lead <slug> [--base <url>]");
  process.exit(1);
}

const outDir = path.join("public", "proposals", slug);
await fs.mkdir(outDir, { recursive: true });

const browser = await pw.chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

async function shoot(name, viewport, deviceScaleFactor) {
  const context = await browser.newContext({ viewport, deviceScaleFactor, locale: "es-ES" });
  const page = await context.newPage();
  await page.goto(`${BASE}/${slug}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
  // Let the hero settle and every reveal above the fold fire.
  await page.evaluate(() => window.scrollTo(0, 1));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
  // The phone action bar and install banner are chrome, not the design.
  await page.addStyleTag({ content: "[role=dialog], .md\\:hidden.fixed { display: none !important }" });
  const file = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: file });
  await context.close();
  console.log(`wrote ${file}`);
}

await shoot("desktop", { width: 1440, height: 900 }, 1);
await shoot("mobile", { width: 390, height: 844 }, 2);

await browser.close();
