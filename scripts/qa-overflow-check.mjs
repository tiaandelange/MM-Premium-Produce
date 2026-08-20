import puppeteer from "puppeteer-core";

const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.env.AUDIT_BASE || "http://localhost:3010";

const viewports = [
  { name: "320", width: 320, height: 900 },
  { name: "375", width: 375, height: 900 },
  { name: "768", width: 768, height: 1000 },
  { name: "1024", width: 1024, height: 1000 },
  { name: "1366", width: 1366, height: 1000 },
  { name: "1440", width: 1440, height: 1000 },
];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const results = [];

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });

  await page.setCookie({ name: "mm-theme", value: "light", url: base });
  await page.goto(base + "/en", { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 600));

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollW = Math.max(doc.scrollWidth, body.scrollWidth);
    const clientW = doc.clientWidth || window.innerWidth;
    const delta = scrollW - clientW;
    return {
      scrollW,
      clientW,
      delta,
      hasHorizontalOverflow: delta > 1,
    };
  });

  results.push({ viewport: vp.name, ...overflow });
  await page.close();
}

await browser.close();

console.log(JSON.stringify(results, null, 2));

