import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.env.AUDIT_BASE || "http://localhost:3010";
const outDir = "scripts/qa";

const shots = [
  // Desktop full-page evidence (all homepage transitions included in a single capture).
  { name: "en-light-1440-homepage-full", path: "/en", theme: "light", width: 1440, height: 900 },
  { name: "en-dark-1440-homepage-full", path: "/en", theme: "dark", width: 1440, height: 900 },
  { name: "af-light-1440-homepage-full", path: "/af", theme: "light", width: 1440, height: 900 },
  { name: "af-dark-1440-homepage-full", path: "/af", theme: "dark", width: 1440, height: 900 },

  // Mobile evidence at 375px.
  { name: "en-light-375-homepage-full", path: "/en", theme: "light", width: 375, height: 900 },
  { name: "en-dark-375-homepage-full", path: "/en", theme: "dark", width: 375, height: 900 },
  { name: "af-light-375-homepage-full", path: "/af", theme: "light", width: 375, height: 900 },
  { name: "af-dark-375-homepage-full", path: "/af", theme: "dark", width: 375, height: 900 },
];

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

for (const shot of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: shot.width, height: shot.height, deviceScaleFactor: 1 });

  // Theme is controlled via cookie in this app.
  await page.setCookie({
    name: "mm-theme",
    value: shot.theme,
    url: base,
  });

  await page.goto(base + shot.path, { waitUntil: "networkidle0", timeout: 60000 });
  // Give scroll-driven reveals and font loading a moment to settle.
  await new Promise((resolve) => setTimeout(resolve, 800));

  await page.screenshot({
    path: `${outDir}/${shot.name}.png`,
    fullPage: true,
  });

  await page.close();
  console.log("wrote", shot.name);
}

await browser.close();

