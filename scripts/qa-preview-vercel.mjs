/**
 * Preview QA using `vercel curl` (bypasses Deployment Protection).
 * Usage: node scripts/qa-preview-vercel.mjs <deployment-url>
 */
import { spawnSync } from "node:child_process";

const deployment = (process.argv[2] ?? "").replace(/\/$/, "");
if (!deployment) {
  console.error("Usage: node scripts/qa-preview-vercel.mjs <deployment-url>");
  process.exit(1);
}

function vercelCurl(path) {
  const result = spawnSync(
    "npx",
    ["vercel", "curl", `${deployment}${path}`, "--yes"],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024, shell: true },
  );
  const out = `${result.stdout || ""}${result.stderr || ""}`;
  // Strip CLI chatter before DOCTYPE / JSON
  const htmlStart = out.indexOf("<!DOCTYPE");
  const html = htmlStart >= 0 ? out.slice(htmlStart) : out;
  const loginWall = /Log in to Vercel|Authentication Required/i.test(html);
  return { status: result.status ?? 1, html, loginWall, raw: out };
}

function check(name, path, predicate) {
  const { html, loginWall, status } = vercelCurl(path);
  const failMarker = ["Something went wrong", "Iets het verkeerd geloop"].find((m) => html.includes(m));
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? null;
  const canonical = html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1]
    ?? html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1]
    ?? null;
  const hreflang = [...html.matchAll(/hreflang=["']([^"']+)["']/gi)].map((m) => m[1]);
  const ok = !loginWall && !failMarker && status === 0 && predicate(html, { h1, canonical, hreflang });
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${name}\n` +
      `  path: ${path}\n` +
      `  h1: ${h1}\n` +
      `  fail: ${failMarker || (loginWall ? "login-wall" : "none")}\n` +
      `  canonical: ${canonical}\n` +
      `  hreflang: ${hreflang.join(",") || "none"}`,
  );
  return ok;
}

const checks = [
  ["home en", "/en", (h) => /Fresh|Quality|M &amp; M|M & M/i.test(h)],
  ["home af", "/af", (h) => /Vars|Kwaliteit|M &amp; M|M & M/i.test(h)],
  ["shop", "/en/shop", (h) => /All produce|Search|Showing/i.test(h)],
  ["shop fruit", "/en/shop/fruit", (h) => /Fruit/i.test(h)],
  ["cherry", "/en/products/cherry-tomatoes", (h) => /Cherry Tomatoes/i.test(h) && /R 34,99/.test(h) && /per 100g/i.test(h) && /400 g/i.test(h) && !/R 34,99\s*\/100g/.test(h)],
  ["spinach", "/en/products/baby-spinach", (h) => /Baby Spinach/i.test(h) && /200 g/i.test(h) && !/R 34,99\s*\/100g/.test(h)],
  ["delivery en", "/en/delivery", (h) => /Gauteng|Owner delivery|R\s?35/i.test(h)],
  ["delivery af", "/af/aflewering", (h) => /Gauteng|Eienaar|R\s?35/i.test(h)],
  ["cart", "/en/cart", (h) => /Cart|cart/i.test(h)],
  ["checkout", "/en/checkout", (h) => /Checkout|EFT/i.test(h)],
  ["betaal", "/af/betaal", (h) => /Betaal|EFT/i.test(h)],
  ["about", "/en/about", (h) => /About|Meagan|Quality/i.test(h)],
  ["faq", "/en/faq", (h) => /Frequently asked/i.test(h)],
  ["guides", "/en/guides", (h) => /[Gg]uides/.test(h)],
  ["recipes", "/en/recipes", (h) => /[Rr]ecipes/.test(h)],
  ["contact", "/en/contact", (h) => /hello@mmpp\.co\.za|82 603 8288/i.test(h)],
  ["privacy", "/en/privacy", (h) => /Privacy|draft/i.test(h)],
  ["terms", "/en/terms", (h) => /Terms of sale|draft/i.test(h)],
  ["returns", "/en/delivery-and-returns", (h) => /Delivery and returns|Gauteng|draft/i.test(h)],
  ["bundles", "/en/bundles", (h) => /Coming soon|Produce boxes/i.test(h)],
  ["search", "/en/shop?q=spinach", (h) => /Baby Spinach/i.test(h)],
  ["empty search", "/en/shop?q=zzzz-no-match", (h) => /No products match/i.test(h)],
  ["404 product", "/en/products/this-product-does-not-exist-xyz", (h) => /Page not found/i.test(h)],
];

let passed = 0;
for (const [name, path, pred] of checks) {
  if (check(name, path, pred)) passed += 1;
}
console.log(`\nPreview QA: ${passed}/${checks.length}`);
if (passed !== checks.length) process.exitCode = 1;
