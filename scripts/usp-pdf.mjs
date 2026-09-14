/* Renders the one-page USP document (client voice) to B:/Me/Tagy-USP.pdf. */
import puppeteer from "puppeteer-core";

const OUT_PDF = "B:/Me/Tagy-USP.pdf";
const OUT_PREVIEW =
  "C:/Users/Admin/AppData/Local/Temp/claude/B--Me/7520bd80-10f2-4aa6-ad16-2c7a76ec6db4/scratchpad/usp-preview.jpg";

const html = `<!doctype html>
<html><head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62.5..125,100..900&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap">
<style>
  :root {
    --paper: #ecf1ea;
    --ink: #14201a;
    --haze: #4d6156;
    --dim: #85978b;
    --trace: #0c7f47;
    --line: rgba(20, 32, 26, 0.16);
  }
  * { margin: 0; box-sizing: border-box; }
  html, body { background: var(--paper); }
  .page {
    position: relative;
    width: 210mm;
    height: 297mm;
    padding: 20mm 18mm;
    background: var(--paper);
    color: var(--ink);
    font-family: "Archivo", sans-serif;
    display: flex;
    flex-direction: column;
  }
  .tick { position: absolute; width: 5mm; height: 5mm; border-color: var(--dim); border-style: solid; border-width: 0; }
  .tick.tl { top: 8mm; left: 8mm; border-top-width: 1px; border-left-width: 1px; }
  .tick.tr { top: 8mm; right: 8mm; border-top-width: 1px; border-right-width: 1px; }
  .tick.bl { bottom: 8mm; left: 8mm; border-bottom-width: 1px; border-left-width: 1px; }
  .tick.br { bottom: 8mm; right: 8mm; border-bottom-width: 1px; border-right-width: 1px; }

  .mono { font-family: "IBM Plex Mono", monospace; }
  .eyebrow {
    font-family: "IBM Plex Mono", monospace;
    font-size: 8.5pt; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--haze);
    display: flex; justify-content: space-between; align-items: baseline;
  }
  header { border-bottom: 1px solid var(--line); padding-bottom: 6mm; }
  header h1 {
    margin-top: 7mm;
    font-weight: 850; font-stretch: 118%;
    text-transform: uppercase; letter-spacing: -0.01em;
    font-size: 22pt; line-height: 1;
  }
  header .role { margin-top: 2.5mm; color: var(--haze); font-size: 10.5pt; }

  .sec-label {
    font-family: "IBM Plex Mono", monospace;
    font-size: 8.5pt; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--haze); display: flex; align-items: center; gap: 3mm;
  }
  .sec-label .idx { color: var(--dim); }
  .sec-label::after { content: ""; flex: 1; height: 1px; background: var(--line); }

  .pitch {
    margin-top: 7mm;
    font-size: 16.5pt; line-height: 1.55; font-weight: 500;
    letter-spacing: 0.002em;
  }
  .pitch .go { color: var(--trace); font-weight: 650; }

  .display {
    margin-top: 8mm;
    font-weight: 900; font-stretch: 120%;
    text-transform: uppercase; letter-spacing: -0.015em;
    font-size: 25pt; line-height: 1.12;
    white-space: nowrap;
  }
  .display .serif {
    font-family: "Instrument Serif", serif; font-style: italic; font-weight: 400;
    text-transform: lowercase; color: var(--trace); letter-spacing: 0;
  }
  .support {
    margin-top: 6mm;
    font-size: 12pt; line-height: 1.6; color: var(--haze); max-width: 150mm;
  }
  .status {
    margin-top: 6mm;
    font-family: "IBM Plex Mono", monospace; font-size: 9pt;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink);
    display: flex; align-items: center; gap: 2.5mm;
  }
  .status .dot { width: 2.2mm; height: 2.2mm; border-radius: 50%; background: var(--trace); }

  footer {
    margin-top: 12mm; border-top: 1px solid var(--line); padding-top: 5mm;
    display: flex; justify-content: space-between; align-items: flex-end;
    font-family: "IBM Plex Mono", monospace; font-size: 8pt;
    letter-spacing: 0.08em; color: var(--haze);
  }
  footer .contact { display: grid; gap: 1.6mm; }
  footer .nmea { color: var(--dim); }
  section { margin-top: 11mm; }
  section.two { margin-top: auto; padding-bottom: 2mm; }
</style></head>
<body>
<div class="page">
  <span class="tick tl"></span><span class="tick tr"></span>
  <span class="tick bl"></span><span class="tick br"></span>

  <header>
    <div class="eyebrow"><span>Unique Selling Proposition</span><span>31°12′N 29°55′E — Alexandria, EG</span></div>
    <h1>Mohamed Waleed Tagy</h1>
    <p class="role">Solution architect track · Dynamics 365 &amp; Power Platform · AI, automation and web delivery</p>
  </header>

  <section>
    <div class="sec-label"><span class="idx">[01]</span><span>The pitch</span></div>
    <p class="pitch">I help businesses turn their ideas and manual, repetitive processes into <span class="go">working digital solutions</span> that save time, cut errors, and create real value — through my skills in Microsoft Dynamics 365 and the Power Platform, AI and computer vision, process automation, and web development.</p>
  </section>

  <section class="two">
    <div class="sec-label"><span class="idx">[02]</span><span>The short of it</span></div>
    <div class="display">
      Manual processes in.<br>
      <span class="serif">verified</span> systems out.
    </div>
    <p class="support">Business platforms, AI and computer vision, automation, and web — delivered end-to-end, from requirements to a solution running in production.</p>
    <p class="status"><span class="dot"></span>Nothing ships until it&rsquo;s tested and verified</p>
  </section>

  <footer>
    <span class="contact">
      <span>mohamed.120230167@ejust.edu.eg&nbsp;&nbsp;·&nbsp;&nbsp;+20 100 876 5599</span>
      <span>mohamed-tagy.vercel.app&nbsp;&nbsp;·&nbsp;&nbsp;github.com/Mohamed-Tagy&nbsp;&nbsp;·&nbsp;&nbsp;linkedin.com/in/mohamed-tagy</span>
    </span>
    <span class="nmea">$MWUSP,V1,ALX*7E</span>
  </footer>
</div>
</body></html>`;

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--force-color-profile=srgb"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1400, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);

  const el = await page.$(".page");
  await el.screenshot({ path: OUT_PREVIEW, type: "jpeg", quality: 92 });

  await page.pdf({
    path: OUT_PDF,
    format: "A4",
    printBackground: true,
    pageRanges: "1",
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  console.log("written:", OUT_PDF);
} finally {
  await browser.close();
}
