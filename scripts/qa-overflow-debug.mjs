import puppeteer from "puppeteer-core";

const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.env.AUDIT_BASE || "http://localhost:3010";
const width = Number(process.env.VP_WIDTH || 375);
const height = Number(process.env.VP_HEIGHT || 900);

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 1 });
await page.setCookie({ name: "mm-theme", value: "light", url: base });
await page.goto(base + "/en", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 600));

const report = await page.evaluate(() => {
  const clientW = document.documentElement.clientWidth || window.innerWidth;
  const doc = document.documentElement;
  const body = document.body;
  const scrollW = Math.max(doc.scrollWidth, body.scrollWidth);

  let worst = { right: -Infinity, left: Infinity, width: 0, selector: "" };

  const nodes = Array.from(document.querySelectorAll("*"));
  for (const el of nodes) {
    const r = el.getBoundingClientRect();
    // Skip invisible/zero-size nodes for speed.
    if (r.width < 1 || r.height < 1) continue;
    if (r.right > worst.right) {
      // Best-effort selector.
      const id = el.id ? `#${el.id}` : "";
      const cls = el.className
        ? `.${String(el.className)
            .trim()
            .split(/\\s+/)
            .slice(0, 3)
            .join(".")}`
        : "";
      worst = {
        right: r.right,
        left: r.left,
        width: r.width,
        selector: `${el.tagName.toLowerCase()}${id}${cls}`,
      };
    }
  }

  return { clientW, scrollW, delta: scrollW - clientW, worst };
});

await browser.close();
console.log(JSON.stringify(report, null, 2));

