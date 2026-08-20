/**
 * Final launch visual/responsive/a11y QA against a local production server.
 * Usage: AUDIT_BASE=http://localhost:3011 node scripts/qa-launch-visual.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const chrome = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = (process.env.AUDIT_BASE || "http://127.0.0.1:3011").replace(/\/$/, "");
const outDir = path.join("scripts", "qa", "launch-final");

const viewports = [
  { name: "320x568", width: 320, height: 568 },
  { name: "375x812", width: 375, height: 812 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
];

const routes = [
  { id: "home-en", path: "/en", shot: true },
  { id: "home-af", path: "/af", shot: true },
  { id: "shop-en", path: "/en/shop", shot: true },
  { id: "shop-af", path: "/af/winkel", shot: true },
  { id: "fruit", path: "/en/shop/fruit", shot: true },
  { id: "cherry", path: "/en/products/cherry-tomatoes", shot: true },
  { id: "cherry-af", path: "/af/produkte/kerrietamaties", shot: false },
  { id: "spinach", path: "/en/products/baby-spinach", shot: false },
  { id: "avocado", path: "/en/products/avocados", shot: false },
  { id: "delivery-en", path: "/en/delivery", shot: true },
  { id: "delivery-af", path: "/af/aflewering", shot: false },
  { id: "cart", path: "/en/cart", shot: true },
  { id: "checkout", path: "/en/checkout", shot: true },
  { id: "betaal", path: "/af/betaal", shot: false },
  { id: "about", path: "/en/about", shot: true },
  { id: "contact", path: "/en/contact", shot: true },
  { id: "privacy", path: "/en/privacy", shot: false },
  { id: "terms", path: "/en/terms", shot: false },
  { id: "returns", path: "/en/delivery-and-returns", shot: false },
  { id: "bundles", path: "/en/bundles", shot: true },
  { id: "404", path: "/en/products/this-product-does-not-exist-xyz", shot: false },
];

const report = {
  base,
  startedAt: new Date().toISOString(),
  overflows: [],
  consoleErrors: [],
  digests: [],
  navChecks: [],
  pricing: [],
  a11y: [],
  reducedMotion: null,
  zoom200: null,
  catalogue: null,
  shots: [],
};

function digestHits(text) {
  return ["4266824602", "1426832316", "2271768228"].filter((d) => text.includes(d));
}

async function measureOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const delta = Math.max(doc.scrollWidth, body.scrollWidth) - (doc.clientWidth || window.innerWidth);
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      if (!(el instanceof HTMLElement)) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width > window.innerWidth + 1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          className: String(el.className).slice(0, 80),
          width: Math.round(rect.width),
        });
      }
      if (offenders.length >= 8) break;
    }
    return { delta, hasHorizontalOverflow: delta > 1, offenders };
  });
}

async function collectConsole(page, bucket) {
  page.on("pageerror", (err) => bucket.push({ type: "pageerror", text: String(err) }));
  page.on("console", (msg) => {
    if (msg.type() === "error") bucket.push({ type: "console", text: msg.text() });
  });
  page.on("response", (res) => {
    const url = res.url();
    if (!url.startsWith(base)) return;
    if (res.status() >= 400) bucket.push({ type: "network", text: `${res.status()} ${url}` });
  });
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

await mkdir(outDir, { recursive: true });

// Core matrix: all viewports × themes on home+shop; major templates at 375+1440 light/dark.
const matrix = [];
for (const theme of ["light", "dark"]) {
  for (const vp of viewports) {
    matrix.push({ theme, vp, route: routes.find((r) => r.id === "home-en") });
    matrix.push({ theme, vp, route: routes.find((r) => r.id === "shop-en") });
  }
}
for (const theme of ["light", "dark"]) {
  for (const vp of viewports.filter((v) => v.name === "375x812" || v.name === "1440x900")) {
    for (const route of routes.filter((r) => r.shot && !["home-en", "shop-en"].includes(r.id))) {
      matrix.push({ theme, vp, route });
    }
  }
}
// Remaining required routes once at desktop light.
for (const route of routes.filter((r) => !r.shot)) {
  matrix.push({ theme: "light", vp: viewports.find((v) => v.name === "1440x900"), route });
}

for (const item of matrix) {
  const { theme, vp, route } = item;
  if (!route || !vp) continue;
  const page = await browser.newPage();
  const errors = [];
  await collectConsole(page, errors);
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  await page.setCookie({ name: "mm-theme", value: theme, url: base });
  let res;
  try {
    res = await page.goto(`${base}${route.path}`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 20000 }).catch(() => {});
  } catch (err) {
    report.consoleErrors.push({
      route: route.path,
      theme,
      vp: vp.name,
      errors: [{ type: "navigation", text: String(err) }],
    });
    await page.close();
    continue;
  }
  await new Promise((r) => setTimeout(r, 250));
  const html = await page.content();
  const hits = digestHits(html);
  if (hits.length) report.digests.push({ route: route.path, theme, vp: vp.name, hits });
  const overflow = await measureOverflow(page);
  if (overflow.hasHorizontalOverflow) {
    report.overflows.push({ route: route.path, theme, vp: vp.name, ...overflow });
  }
  if (errors.length) {
    report.consoleErrors.push({ route: route.path, theme, vp: vp.name, errors });
  }
  if (
    route.shot &&
    theme === "light" &&
    (vp.name === "1440x900" || vp.name === "375x812")
  ) {
    const file = `${route.id}-${theme}-${vp.name}.png`;
    await page.screenshot({ path: path.join(outDir, file), fullPage: false });
    report.shots.push(file);
  }
  if (res && res.status() >= 500) {
    report.consoleErrors.push({
      route: route.path,
      theme,
      vp: vp.name,
      errors: [{ type: "status", text: String(res.status()) }],
    });
  }
  await page.close();
}

// Nav coming-soon check
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setCookie({ name: "mm-theme", value: "light", url: base });
  await page.goto(`${base}/en`, { waitUntil: "networkidle0", timeout: 60000 });
  const enNav = await page.evaluate(() => {
    const link = document.querySelector('.site-nav a.nav-coming-soon, .site-nav a[aria-label*="Coming soon"]');
    const footer = document.querySelector('footer a.nav-coming-soon, footer a[aria-label*="Coming soon"]');
    return {
      headerLabel: link?.getAttribute("aria-label") || link?.textContent?.trim() || null,
      footerLabel: footer?.getAttribute("aria-label") || footer?.textContent?.trim() || null,
      href: link?.getAttribute("href") || null,
    };
  });
  await page.goto(`${base}/af`, { waitUntil: "networkidle0", timeout: 60000 });
  const afNav = await page.evaluate(() => {
    const link = document.querySelector('.site-nav a.nav-coming-soon, .site-nav a[aria-label*="Binnekort"]');
    return {
      headerLabel: link?.getAttribute("aria-label") || link?.textContent?.trim() || null,
      href: link?.getAttribute("href") || null,
    };
  });
  report.navChecks.push({ enNav, afNav });
  await page.close();
}

// Pricing samples
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setCookie({ name: "mm-theme", value: "light", url: base });
  for (const slug of ["cherry-tomatoes", "baby-spinach", "avocados", "tomatoes"]) {
    await page.goto(`${base}/en/products/${slug}`, { waitUntil: "networkidle0", timeout: 60000 });
    const pricing = await page.evaluate(() => {
      const main = document.querySelector("main")?.innerText || "";
      return {
        hasSlash100gOnPrimary: /R\s?\d+[.,]\d{2}\s*\/100g/i.test(main),
        hasPer100g: /per 100g/i.test(main),
        hasPriceToConfirm: /Price to be confirmed/i.test(main),
        hasAddToCart: /Add to cart/i.test(main),
        snippet: main.slice(0, 500),
      };
    });
    report.pricing.push({ slug, ...pricing });
  }
  await page.close();
}

// Catalogue interactions
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setCookie({ name: "mm-theme", value: "light", url: base });
  await page.goto(`${base}/en/shop?q=spinach`, { waitUntil: "networkidle0", timeout: 60000 });
  const searchOk = (await page.content()).includes("Baby Spinach");
  await page.goto(`${base}/en/shop?q=zzzz-no-match`, { waitUntil: "networkidle0", timeout: 60000 });
  const emptyOk = (await page.content()).includes("No products match");
  await page.goto(`${base}/en/shop?availability=in_stock&sort=price-asc`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });
  const filterUrl = page.url();
  const labels = await page.evaluate(() => {
    const named = [...document.querySelectorAll("label, [aria-label]")].map((el) =>
      (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40),
    );
    return named.slice(0, 20);
  });
  report.catalogue = { searchOk, emptyOk, filterUrl, labels };
  await page.close();
}

// Keyboard / landmarks / reduced motion
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.setCookie({ name: "mm-theme", value: "light", url: base });
  await page.goto(`${base}/en`, { waitUntil: "networkidle0", timeout: 60000 });
  report.reducedMotion = await page.evaluate(() => {
    const hidden = [...document.querySelectorAll("[style*='opacity: 0'], .is-hidden, [hidden]")].length;
    const main = Boolean(document.querySelector("main"));
    const h1 = document.querySelectorAll("h1").length;
    const skip = document.querySelector('a[href="#main"], a[href="#content"], .skip-link');
    return {
      main,
      h1Count: h1,
      skipText: skip?.textContent?.trim() || null,
      suspiciousHidden: hidden,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });
  // Focus skip link via Tab
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      tag: el?.tagName,
      className: el?.className,
      text: el?.textContent?.trim()?.slice(0, 60) || null,
      outline: el ? getComputedStyle(el).outlineStyle : null,
    };
  });
  report.a11y.push({ focused });
  await page.close();
}

// 200% zoom usability proxy via deviceScaleFactor + smaller CSS viewport
{
  const page = await browser.newPage();
  await page.setViewport({ width: 720, height: 450, deviceScaleFactor: 2 });
  await page.setCookie({ name: "mm-theme", value: "light", url: base });
  await page.goto(`${base}/en/shop`, { waitUntil: "networkidle0", timeout: 60000 });
  report.zoom200 = await measureOverflow(page);
  const file = "shop-zoom200-proxy.png";
  await page.screenshot({ path: path.join(outDir, file), fullPage: false });
  report.shots.push(file);
  await page.close();
}

await browser.close();
report.finishedAt = new Date().toISOString();
await writeFile(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  overflows: report.overflows.length,
  consoleBuckets: report.consoleErrors.length,
  digests: report.digests.length,
  navChecks: report.navChecks,
  pricingFlags: report.pricing.filter((p) => p.hasSlash100gOnPrimary),
  catalogue: report.catalogue,
  reducedMotion: report.reducedMotion,
  zoom200: report.zoom200,
  shots: report.shots.length,
  outDir,
}, null, 2));
