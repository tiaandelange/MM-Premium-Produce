import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.env.AUDIT_BASE || "http://localhost:3008";
const outDir = "scripts/qa";

const shots = [
  { name: "en-dark-1168", path: "/en", theme: "dark", width: 1168, height: 794 },
  { name: "en-light-1168", path: "/en", theme: "light", width: 1168, height: 794 },
  { name: "en-dark-1366", path: "/en", theme: "dark", width: 1366, height: 768 },
  { name: "en-dark-1440", path: "/en", theme: "dark", width: 1440, height: 900 },
  { name: "en-light-1440", path: "/en", theme: "light", width: 1440, height: 900 },
  { name: "en-dark-1920", path: "/en", theme: "dark", width: 1920, height: 1080 },
  { name: "en-dark-768", path: "/en", theme: "dark", width: 768, height: 1024 },
  { name: "en-dark-430", path: "/en", theme: "dark", width: 430, height: 932 },
  { name: "en-dark-390", path: "/en", theme: "dark", width: 390, height: 844 },
  { name: "en-light-390", path: "/en", theme: "light", width: 390, height: 844 },
  { name: "af-dark-1168", path: "/af", theme: "dark", width: 1168, height: 794 },
];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

await mkdir(outDir, { recursive: true });

for (const shot of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: shot.width, height: shot.height, deviceScaleFactor: 1 });
  await page.setCookie({
    name: "mm-theme",
    value: shot.theme,
    url: base,
  });
  await page.goto(base + shot.path, { waitUntil: "networkidle0", timeout: 60000 });
  await page.screenshot({ path: `${outDir}/${shot.name}.png`, fullPage: false });
  await page.close();
  console.log("wrote", shot.name);
}

await browser.close();
