import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.env.AUDIT_BASE || "http://localhost:3021";
const outDir = "scripts/qa";

const cartValue = JSON.stringify({
  v: 1,
  items: [{ productId: "prod_baby_spinach", variantId: null, quantity: 1 }],
});

const shots = [
  { name: "en-dark-1440-cart-empty", path: "/en/cart", theme: "dark", width: 1440, height: 900, populated: false },
  { name: "en-dark-1440-cart-populated", path: "/en/cart", theme: "dark", width: 1440, height: 900, populated: true },
  { name: "en-dark-375-cart-populated", path: "/en/cart", theme: "dark", width: 375, height: 812, populated: true },
  { name: "en-dark-1440-checkout-empty", path: "/en/checkout", theme: "dark", width: 1440, height: 900, populated: false },
  { name: "en-dark-1440-checkout-populated", path: "/en/checkout", theme: "dark", width: 1440, height: 900, populated: true },
  { name: "en-dark-375-checkout-populated", path: "/en/checkout", theme: "dark", width: 375, height: 812, populated: true },
  { name: "en-dark-1440-delivery", path: "/en/delivery", theme: "dark", width: 1440, height: 900, populated: false },
  { name: "en-dark-375-delivery", path: "/en/delivery", theme: "dark", width: 375, height: 812, populated: false },
  { name: "af-dark-1440-delivery", path: "/af/aflewering", theme: "dark", width: 1440, height: 900, populated: false },
  { name: "af-dark-375-delivery", path: "/af/aflewering", theme: "dark", width: 375, height: 812, populated: false },
  { name: "en-light-1440-delivery", path: "/en/delivery", theme: "light", width: 1440, height: 900, populated: false },
  { name: "af-light-1440-delivery", path: "/af/aflewering", theme: "light", width: 1440, height: 900, populated: false },
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
  await page.deleteCookie({ name: "mm-cart", url: base });
  await page.setCookie({ name: "mm-theme", value: shot.theme, url: base });
  await page.setCookie({
    name: "mm-cart",
    value: shot.populated ? cartValue : JSON.stringify({ v: 1, items: [] }),
    url: base,
  });
  await page.goto(base + shot.path, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: `${outDir}/${shot.name}.png`, fullPage: true });
  await page.close();
  console.log("wrote", shot.name);
}

await browser.close();
