import puppeteer from "puppeteer-core";

const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.env.AUDIT_BASE || "http://localhost:3000";
const theme = process.env.THEME || "light";

const cartValue = JSON.stringify({
  v: 1,
  items: [{ productId: "prod_baby_spinach", variantId: null, quantity: 1 }],
});

const cases = [
  { name: "en-cart-empty", path: "/en/cart", populated: false },
  { name: "en-cart-populated", path: "/en/cart", populated: true },
  { name: "af-cart-empty", path: "/af/mandjie", populated: false },
  { name: "af-cart-populated", path: "/af/mandjie", populated: true },
  { name: "en-checkout-empty", path: "/en/checkout", populated: false },
  { name: "en-checkout-populated", path: "/en/checkout", populated: true },
  { name: "af-checkout-empty", path: "/af/betaal", populated: false },
  { name: "af-checkout-populated", path: "/af/betaal", populated: true },
];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const results = [];

for (const testCase of cases) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.deleteCookie({ name: "mm-cart", url: base });
  await page.deleteCookie({ name: "mm-theme", url: base });

  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => {
    const text = msg.text();
    if (msg.type() === "error" || /hydrat/i.test(text)) {
      consoleErrors.push({ type: msg.type(), text });
    }
  });
  page.on("pageerror", (err) => {
    pageErrors.push(err.message);
  });

  await page.setCookie({ name: "mm-theme", value: theme, url: base });
  if (testCase.populated) {
    await page.setCookie({ name: "mm-cart", value: cartValue, url: base });
  } else {
    await page.setCookie({
      name: "mm-cart",
      value: JSON.stringify({ v: 1, items: [] }),
      url: base,
    });
  }

  await page.goto(base + testCase.path, { waitUntil: "networkidle0", timeout: 90000 });
  await new Promise((r) => setTimeout(r, 1000));

  results.push({
    name: testCase.name,
    path: testCase.path,
    populated: testCase.populated,
    consoleErrorCount: consoleErrors.length,
    pageErrorCount: pageErrors.length,
    consoleErrors: consoleErrors.slice(0, 6),
    pageErrors: pageErrors.slice(0, 6),
  });

  await page.close();
}

await browser.close();

const failed = results.filter((r) => r.consoleErrorCount > 0 || r.pageErrorCount > 0);
console.log(JSON.stringify({ failed: failed.length, results }, null, 2));
if (failed.length) process.exit(1);
