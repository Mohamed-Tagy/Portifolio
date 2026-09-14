/*
 * Renders the live site (night watch only) in headless Chrome and binds
 * section-per-page captures into a review PDF.
 *
 *   node scripts/export-pdf.mjs [url] [outfile]
 */

import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import puppeteer from "puppeteer-core";

const URL = process.argv[2] ?? "http://localhost:3000";
const OUT = process.argv[3] ?? "B:/Me/Tagy-Portfolio-Dark.pdf";
/** optional: dump each capture as a JPEG for inspection */
const DUMP = process.env.EXPORT_DUMP_DIR;

const CHROME_PATHS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];

const VOID = rgb(7 / 255, 12 / 255, 9 / 255);
const HAZE = rgb(139 / 255, 163 / 255, 148 / 255);
/** CSS px → PDF pt at our capture scale (images are @2x). */
const PT = (cssPx) => cssPx * 0.75;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function preparePage(browser, viewport) {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem("mwt-booted", "1"); // skip the preloader
      localStorage.setItem("mwt-theme", "night"); // dark version only
    } catch {}
  });
  await page.setViewport(viewport);
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await sleep(1700); // entrance choreography

  await page.addStyleTag({
    content: `
      nextjs-portal { display: none !important; } /* dev overlay badge */
      .noise::after { display: none !important; } /* fixed grain seams in tall captures */
    `,
  });

  /* one slow pass to fire every once-only reveal */
  await page.evaluate(async () => {
    const step = 380;
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 55));
    }
  });
  await sleep(1100); // footer wordmark settle
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(700);
  return page;
}

async function capture(page, selector, { scrollOffset = -80, settle = 550 } = {}) {
  const el = await page.$(selector);
  if (!el) throw new Error(`selector not found: ${selector}`);
  await page.evaluate(
    (sel, off) => {
      const t = document.querySelector(sel);
      window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY + off);
    },
    selector,
    scrollOffset,
  );
  await sleep(settle);
  const buf = await el.screenshot({ type: "jpeg", quality: 92 });
  const { w, h } = await page.evaluate((sel) => {
    const r = document.querySelector(sel).getBoundingClientRect();
    return { w: r.width, h: r.height };
  }, selector);
  return { buf, w, h };
}

async function main() {
  const executablePath = CHROME_PATHS.find((p) => existsSync(p));
  if (!executablePath) throw new Error("no Chrome/Edge found");

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ["--hide-scrollbars", "--force-color-profile=srgb"],
  });

  try {
    /* ---------------- desktop deck ---------------- */
    const page = await preparePage(browser, {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
    });

    const shots = [];

    /* hero — nav on, beacon glow placed; cursor ring hidden for the still */
    await page.mouse.move(1030, 430, { steps: 6 });
    await sleep(650);
    await page.evaluate(() =>
      document.documentElement.dispatchEvent(new Event("mouseleave")),
    );
    await sleep(350);
    shots.push(await capture(page, "#home", { scrollOffset: 0, settle: 350 }));

    /* park the cursor overlay and the fixed nav for the rest */
    await page.evaluate(() =>
      document.documentElement.dispatchEvent(new Event("mouseleave")),
    );
    await page.evaluate(() => {
      document.querySelector("header").style.visibility = "hidden";
    });

    shots.push(await capture(page, "#about"));
    shots.push(await capture(page, "#projects > div > div:first-child"));
    for (let i = 1; i <= 5; i++)
      shots.push(await capture(page, `#projects article:nth-of-type(${i})`));
    shots.push(await capture(page, "#skills"));

    /* experience mid-scroll so the track line shows its fill */
    await page.evaluate(() => {
      const t = document.querySelector("#experience");
      const top = t.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + t.getBoundingClientRect().height * 0.45 - 450);
    });
    await sleep(600);
    const exp = await page.$("#experience");
    const expBuf = await exp.screenshot({ type: "jpeg", quality: 92 });
    const expBox = await page.evaluate(() => {
      const r = document.querySelector("#experience").getBoundingClientRect();
      return { w: r.width, h: r.height };
    });
    shots.push({ buf: expBuf, w: expBox.w, h: expBox.h });

    shots.push(await capture(page, 'section[aria-label="Principles"]'));

    /* contact — glow follows a placed pointer */
    await page.evaluate(() => {
      const t = document.querySelector("#contact");
      window.scrollTo(0, t.getBoundingClientRect().top + window.scrollY);
    });
    await sleep(400);
    await page.mouse.move(720, 470, { steps: 6 });
    await sleep(650);
    await page.evaluate(() =>
      document.documentElement.dispatchEvent(new Event("mouseleave")),
    );
    await sleep(350);
    shots.push(await capture(page, "#contact", { scrollOffset: 0, settle: 200 }));

    await page.evaluate(() =>
      document.documentElement.dispatchEvent(new Event("mouseleave")),
    );
    shots.push(await capture(page, "footer", { scrollOffset: -200 }));
    await page.close();

    /* ---------------- mobile appendix ---------------- */
    const mob = await preparePage(browser, {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const mobileShots = [];
    mobileShots.push(await capture(mob, "#home", { scrollOffset: 0 }));
    await mob.evaluate(() => {
      document.querySelector("header").style.visibility = "hidden";
    });
    mobileShots.push(await capture(mob, "#projects article:nth-of-type(1)"));
    mobileShots.push(await capture(mob, "#contact"));
    await mob.close();

    /* ---------------- bind ---------------- */
    if (DUMP) {
      await Promise.all([
        ...shots.map((s, i) =>
          writeFile(`${DUMP}/page-${String(i + 1).padStart(2, "0")}.jpg`, s.buf),
        ),
        ...mobileShots.map((s, i) =>
          writeFile(`${DUMP}/mobile-${i + 1}.jpg`, s.buf),
        ),
      ]);
    }

    const doc = await PDFDocument.create();
    doc.setTitle("Mohamed Tagy — Portfolio · Night Watch");
    doc.setAuthor("Mohamed Waleed Tagy");
    doc.setSubject("Portfolio design review export (dark theme)");
    doc.setCreator("export-pdf.mjs — rendered from the live site");
    const mono = await doc.embedFont(StandardFonts.Courier);

    for (const s of shots) {
      const img = await doc.embedJpg(s.buf);
      const pw = PT(s.w);
      const ph = PT(s.h);
      const p = doc.addPage([pw, ph]);
      p.drawRectangle({ x: 0, y: 0, width: pw, height: ph, color: VOID });
      p.drawImage(img, { x: 0, y: 0, width: pw, height: ph });
    }

    /* mobile plates, side by side on one dark page */
    const gutter = 20;
    const capH = 34;
    const widths = mobileShots.map((s) => PT(s.w));
    const heights = mobileShots.map((s) => PT(s.h));
    const pw = widths.reduce((a, b) => a + b, 0) + gutter * (widths.length + 1);
    const ph = Math.max(...heights) + gutter * 2 + capH;
    const p = doc.addPage([pw, ph]);
    p.drawRectangle({ x: 0, y: 0, width: pw, height: ph, color: VOID });
    p.drawText("MOBILE — 390 x 844 · NIGHT WATCH", {
      x: gutter,
      y: ph - capH + 10,
      size: 9,
      font: mono,
      color: HAZE,
    });
    let x = gutter;
    for (const s of mobileShots) {
      const img = await doc.embedJpg(s.buf);
      const w = PT(s.w);
      const h = PT(s.h);
      p.drawImage(img, { x, y: ph - capH - gutter - h, width: w, height: h });
      x += w + gutter;
    }

    await writeFile(OUT, await doc.save());
    console.log(`written: ${OUT} (${shots.length + 1} pages)`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
