import puppeteer from "puppeteer-core";

const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.env.AUDIT_BASE || "http://localhost:3013";

const cartValue = JSON.stringify({
  v: 1,
  items: [{ productId: "prod_baby_spinach", variantId: null, quantity: 1 }],
});

const routes = [
  { path: "/en", populated: false },
  { path: "/en/shop/fruit", populated: false },
  { path: "/en/products/baby-spinach", populated: false },
  { path: "/en/delivery", populated: false },
  { path: "/en/cart", populated: false },
  { path: "/en/cart", populated: true },
  { path: "/af/mandjie", populated: false },
  { path: "/af/mandjie", populated: true },
  { path: "/en/checkout", populated: false },
  { path: "/en/checkout", populated: true },
  { path: "/af/betaal", populated: false },
  { path: "/af/betaal", populated: true },
];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const results = [];

for (const r of routes) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 800, deviceScaleFactor: 1 });
  await page.deleteCookie({ name: "mm-cart", url: base });
  await page.setCookie({ name: "mm-theme", value: "dark", url: base });
  await page.setCookie({
    name: "mm-cart",
    value: r.populated ? cartValue : JSON.stringify({ v: 1, items: [] }),
    url: base,
  });

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push({ type: "console", text: msg.text() });
  });
  page.on("pageerror", (err) => {
    errors.push({ type: "pageerror", text: err.message });
  });

  await page.goto(base + r.path, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((res) => setTimeout(res, 500));

  results.push({
    route: r.path,
    populated: r.populated,
    errorCount: errors.length,
    sample: errors.slice(0, 5),
  });
  await page.close();
}

await browser.close();
const failed = results.filter((row) => row.errorCount > 0);
console.log(JSON.stringify({ failed: failed.length, results }, null, 2));
if (failed.length) process.exit(1);
