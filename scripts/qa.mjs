/**
 * Visual + functional QA for every demo in the factory.
 *
 * Crawls the site from the roots it is given, opens every internal page at
 * phone and desktop width, and fails on the things that actually embarrass a
 * demo: console errors, broken requests, horizontal overflow, empty pages and
 * placeholder text. Screenshots land in --out.
 *
 *   node scripts/qa.mjs --base http://localhost:3000 --out .qa [--book]
 */
import fs from "node:fs/promises";
import path from "node:path";

const pw = (await import("/opt/node22/lib/node_modules/playwright/index.js")).default;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const BASE = (flag("base", "http://localhost:3000")).replace(/\/$/, "");
const OUT = flag("out", ".qa");
const DO_BOOK = args.includes("--book");
const ROOTS = ["/", "/sousa", "/sousa/propuesta"];

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true },
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false },
];

const PLACEHOLDERS = [
  "lorem ipsum",
  "example@example.com",
  "123 main street",
  "john doe",
  "servicio 1",
  "service 1",
  "testimonial goes here",
  "undefined",
  "[object object]",
  "null",
];

// 1×1 transparent PNG. Stands in for remote imagery so layout can be checked
// even where the CDN is unreachable from this machine.
const STUB_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);

const problems = [];
const note = (where, what) => problems.push(`${where}: ${what}`);

/** Serves a placeholder for optimised images so layout QA doesn't depend on the CDN. */
async function stubImages(context) {
  await context.route("**/_next/image**", (route) =>
    route.fulfill({ status: 200, contentType: "image/png", body: STUB_PNG })
  );
}

async function collectLinks(page) {
  return page.$$eval("a[href]", (as) =>
    as.map((a) => a.getAttribute("href")).filter((h) => h && !h.startsWith("#"))
  );
}

async function run() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await pw.chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

  const seen = new Set();
  const queue = [...ROOTS];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      locale: "es-ES",
    });
    await stubImages(context);
    const pages = vp === VIEWPORTS[0] ? queue : [...seen];
    const toVisit = [...pages];
    const visited = new Set();

    while (toVisit.length) {
      const route = toVisit.shift();
      if (visited.has(route)) continue;
      visited.add(route);
      seen.add(route);

      const page = await context.newPage();
      const errors = [];
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
      page.on("requestfailed", (r) => {
        const url = r.url();
        // Next.js cancels in-flight route prefetches on navigation; an aborted
        // prefetch is normal behaviour, not a broken request.
        const reason = r.failure()?.errorText ?? "";
        if (url.startsWith(BASE) && !reason.includes("ERR_ABORTED")) {
          errors.push(`request failed: ${url} (${reason})`);
        }
      });

      let response;
      try {
        response = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 });
      } catch (e) {
        note(`${vp.name} ${route}`, `navigation failed — ${e.message}`);
        await page.close();
        continue;
      }

      if (!response || response.status() >= 400) {
        note(`${vp.name} ${route}`, `HTTP ${response ? response.status() : "no response"}`);
      }

      // Smooth scrolling would leave the page mid-animation when the shot is taken.
      await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });

      // Scroll through so lazy reveals fire and sticky elements settle.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 400));
      });

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        textLength: (document.body.innerText || "").trim().length,
        text: (document.body.innerText || "").toLowerCase(),
        // Only count reveals that are actually laid out: a block hidden at this
        // breakpoint can never intersect, and that is not a bug.
        hiddenReveals: Array.from(
          document.querySelectorAll('.reveal[data-shown="false"], .p-reveal[data-shown="false"]')
        ).filter((el) => el.getClientRects().length > 0).length,
        tinyText: Array.from(document.querySelectorAll("p, li, span, a, dd, dt"))
          .filter((el) => {
            const size = parseFloat(getComputedStyle(el).fontSize);
            return el.textContent?.trim() && size > 0 && size < 11;
          }).length,
      }));

      if (metrics.scrollWidth > metrics.clientWidth + 1) {
        note(`${vp.name} ${route}`, `horizontal overflow (${metrics.scrollWidth} > ${metrics.clientWidth})`);
      }
      if (metrics.hiddenReveals > 0) {
        note(`${vp.name} ${route}`, `${metrics.hiddenReveals} reveal block(s) never became visible`);
      }
      if (metrics.textLength < 140) {
        note(`${vp.name} ${route}`, `page looks empty (${metrics.textLength} chars of text)`);
      }
      for (const bad of PLACEHOLDERS) {
        if (metrics.text.includes(bad)) note(`${vp.name} ${route}`, `placeholder text found: "${bad}"`);
      }
      if (metrics.tinyText > 0) {
        note(`${vp.name} ${route}`, `${metrics.tinyText} text nodes under 11px`);
      }
      if (errors.length) {
        note(`${vp.name} ${route}`, `console/request errors → ${[...new Set(errors)].slice(0, 4).join(" | ")}`);
      }

      const file = route === "/" ? "root" : route.slice(1).replace(/\//g, "_");
      await page.screenshot({
        path: path.join(OUT, `${vp.name}--${file}.png`),
        fullPage: false,
      });

      if (vp === VIEWPORTS[0]) {
        for (const href of await collectLinks(page)) {
          if (!href.startsWith("/") || href.startsWith("/api")) continue;
          const clean = href.split("#")[0];
          if (!visited.has(clean) && !toVisit.includes(clean)) toVisit.push(clean);
        }
      }

      await page.close();
    }
    await context.close();
  }

  // ---- booking flow --------------------------------------------------------
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: "es-ES" });
  await stubImages(context);
  const page = await context.newPage();
  const bookingErrors = [];
  page.on("pageerror", (e) => bookingErrors.push(e.message));

  try {
    await page.goto(`${BASE}/sousa/reservar`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Corte", exact: true }).click();
    await page.getByRole("button", { name: /Corte Mujer/ }).click();

    // A day a few days out, so the test doesn't depend on the time of day it runs.
    const days = page.locator("button[aria-label^='20']:not([disabled])");
    const dayCount = await days.count();
    if (dayCount === 0) note("booking", "calendar offered no bookable day");
    await days.nth(Math.min(2, dayCount - 1)).click();
    await page.waitForTimeout(1500);

    const slots = page.locator("button:not([disabled])", { hasText: /^\d{2}:\d{2}$/ });
    const slotCount = await slots.count();
    if (slotCount === 0) note("booking", "no bookable time slots offered");
    await slots.first().click();

    // Validation must block an empty form.
    await page.getByRole("button", { name: "Continuar" }).click();
    const errorsShown = await page.locator(".field-error").count();
    if (errorsShown === 0) note("booking", "empty form passed validation");

    await page.getByLabel("Nombre").fill("GRIMHART");
    await page.getByLabel("Apellidos").fill("QA");
    await page.getByLabel("Teléfono").fill("+34600000000");
    await page.getByRole("button", { name: "Continuar" }).click();

    const reviewVisible = await page.getByText("Resumen").isVisible().catch(() => false);
    if (!reviewVisible) note("booking", "review step did not appear");

    if (DO_BOOK) {
      await page.getByRole("button", { name: "Confirmar reserva" }).click();
      await page.waitForTimeout(6000);
      const ok = await page.getByText("Cita confirmada").isVisible().catch(() => false);
      if (!ok) {
        const errText = await page.locator("[role=alert]").innerText().catch(() => "");
        note("booking", `confirmation did not succeed${errText ? ` — ${errText.replace(/\n/g, " ")}` : ""}`);
      }
      await page.screenshot({ path: path.join(OUT, "booking-confirmation.png") });
    } else {
      await page.screenshot({ path: path.join(OUT, "booking-review.png") });
    }
    if (bookingErrors.length) note("booking", `page errors → ${bookingErrors.join(" | ")}`);
  } catch (e) {
    note("booking", `flow failed — ${e.message}`);
    await page.screenshot({ path: path.join(OUT, "booking-failure.png") }).catch(() => {});
  }

  await context.close();
  await browser.close();

  console.log(`\nVisited ${seen.size} routes.`);
  if (problems.length === 0) {
    console.log("QA clean.");
  } else {
    console.log(`\n${problems.length} problem(s):`);
    for (const p of problems) console.log(` - ${p}`);
    process.exitCode = 1;
  }
}

await run();
