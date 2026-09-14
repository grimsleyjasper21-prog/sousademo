/**
 * Per-lead PWA icons, rendered from a monogram.
 *
 *   node scripts/icons.mjs --lead sousa --text SOUSA --bg "#0a0908" --fg "#f3ecdf" --font "Bodoni Moda, serif"
 *
 * Writes the five sizes a manifest needs into public/leads/<slug>/icons/.
 * Replace them with the client's real logo the moment there is one.
 */
import fs from "node:fs/promises";
import path from "node:path";

const pw = (await import("/opt/node22/lib/node_modules/playwright/index.js")).default;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const slug = flag("lead");
if (!slug) {
  console.error("Usage: node scripts/icons.mjs --lead <slug> --text <monogram> [--bg #000] [--fg #fff] [--font 'Georgia, serif']");
  process.exit(1);
}
const text = flag("text", slug.slice(0, 1).toUpperCase());
const bg = flag("bg", "#0a0a0a");
const fg = flag("fg", "#f4f4f2");
const font = flag("font", "Georgia, 'Times New Roman', serif");

const outDir = path.join("public", "leads", slug, "icons");
await fs.mkdir(outDir, { recursive: true });

const browser = await pw.chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

/** `safe` shrinks the mark so a maskable icon survives a circular crop. */
async function icon(file, size, safe) {
  const context = await browser.newContext({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const fontSize = Math.round((size * (safe ? 0.3 : 0.4)) / Math.max(1, Math.min(text.length, 5)) * 2.2);
  await page.setContent(`<!doctype html><html><body style="margin:0">
    <div style="width:${size}px;height:${size}px;background:${bg};display:flex;align-items:center;justify-content:center">
      <span style="font-family:${font};color:${fg};font-size:${fontSize}px;letter-spacing:0.04em;line-height:1;font-weight:500">${text}</span>
    </div></body></html>`);
  await page.screenshot({ path: path.join(outDir, file) });
  await context.close();
  console.log(`wrote ${path.join(outDir, file)}`);
}

await icon("favicon-32.png", 32, false);
await icon("icon-192.png", 192, false);
await icon("icon-512.png", 512, false);
await icon("icon-maskable-192.png", 192, true);
await icon("icon-maskable-512.png", 512, true);
await icon("apple-touch-icon.png", 180, false);

await browser.close();
