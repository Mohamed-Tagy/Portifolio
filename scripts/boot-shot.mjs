/* Captures the boot sequence (fresh profile, no skip flag) and the
   post-boot hero with the new dark atmosphere. */
import puppeteer from "puppeteer-core";

const OUT = "C:/Users/Admin/AppData/Local/Temp/claude/B--Me/7520bd80-10f2-4aa6-ad16-2c7a76ec6db4/scratchpad";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });

  /* wait for the boot screen to mount */
  await page.waitForFunction(
    () => document.body.innerText.includes("BOOT SEQUENCE"),
    { timeout: 30000 },
  );
  await sleep(550);
  await page.screenshot({ path: `${OUT}/boot-mid.jpg`, type: "jpeg", quality: 90 });
  await sleep(450);
  await page.screenshot({ path: `${OUT}/boot-late.jpg`, type: "jpeg", quality: 90 });

  /* after the curtain: hero over the new atmosphere, pointer in the field */
  await sleep(2600);
  await page.mouse.move(1010, 470, { steps: 10 });
  await sleep(900);
  await page.screenshot({ path: `${OUT}/hero-atmo.jpg`, type: "jpeg", quality: 90 });
  await page.screenshot({
    path: `${OUT}/hero-crop.jpg`,
    type: "jpeg",
    quality: 92,
    clip: { x: 740, y: 220, width: 560, height: 480 },
  });

  /* and the atmosphere further down the page (fixed layer everywhere) */
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(1400);
  await page.screenshot({ path: `${OUT}/footer-atmo.jpg`, type: "jpeg", quality: 90 });

  /* day watch, fresh page with the boot skipped */
  const day = await browser.newPage();
  await day.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  await day.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem("mwt-booted", "1");
      localStorage.setItem("mwt-theme", "day");
    } catch {}
  });
  await day.goto("http://localhost:3000", { waitUntil: "networkidle2" });
  await day.addStyleTag({ content: "nextjs-portal{display:none!important}" });
  await sleep(1800);
  await day.screenshot({ path: `${OUT}/hero-day.jpg`, type: "jpeg", quality: 90 });
  await day.close();

  console.log("captured: boot-mid, boot-late, hero-atmo, footer-atmo, hero-day");
} finally {
  await browser.close();
}
