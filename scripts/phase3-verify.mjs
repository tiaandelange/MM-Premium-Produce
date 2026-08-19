const base = process.env.AUDIT_BASE || "http://localhost:3007";

function pick(html, re) {
  return (html.match(re) || [])[1] || null;
}

function all(html, re) {
  return [...html.matchAll(re)].map((m) => m.slice(1));
}

async function request(path, { redirect = "manual", headers = {}, cookie } = {}) {
  const res = await fetch(base + path, {
    redirect,
    headers: { ...headers, ...(cookie ? { cookie } : {}) },
  });
  const html = res.status === 200 || res.status === 404 ? await res.text() : "";
  return { status: res.status, location: res.headers.get("location"), html, robots: res.headers.get("x-robots-tag") };
}

function facts(path, html, status) {
  return {
    path,
    status,
    lang: pick(html, /<html[^>]*lang="([^"]+)"/),
    title: pick(html, /<title>([^<]+)<\/title>/),
    description: pick(html, /name="description" content="([^"]*)"/),
    canonical: pick(html, /rel="canonical" href="([^"]+)"/),
    robots: pick(html, /name="robots" content="([^"]+)"/),
    h1Count: all(html, /<h1\b/g).length,
    hreflang: all(html, /hrefLang="([^"]+)"/g).map((m) => m[0]),
    scripts: all(html, /<script\b/g).length,
    htmlBytes: html.length,
    jsonLd: all(html, /application\/ld\+json"[^>]*>([^<]+)/g).map((m) => {
      try {
        return JSON.parse(m[0]);
      } catch {
        return null;
      }
    }).filter(Boolean),
  };
}

const pages = [
  "/en",
  "/af",
  "/en/shop/fruit",
  "/en/products/baby-spinach",
  "/af/produkte/babaspinasie",
];
const commerce = ["/en/cart", "/en/checkout", "/af/mandjie", "/af/betaal"];
const out = { pages: [], commerce: [], redirects: [], invalids: [], theme: {}, sitemap: {}, issues: [] };

for (const path of pages) {
  const { status, html } = await request(path);
  const row = facts(path, html, status);
  out.pages.push(row);
  if (status !== 200) out.issues.push(`${path} status ${status}`);
  if (row.h1Count !== 1) out.issues.push(`${path} h1=${row.h1Count}`);
  if (!row.canonical) out.issues.push(`${path} missing canonical`);
  if (!row.hreflang.includes("en-ZA") || !row.hreflang.includes("af-ZA") || !row.hreflang.includes("x-default")) {
    out.issues.push(`${path} hreflang ${row.hreflang.join(",")}`);
  }
  if (row.robots && /noindex/.test(row.robots) === false && process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true") {
    /* production indexing not enabled locally */
  }
}

for (const path of commerce) {
  const { status, html } = await request(path);
  const row = facts(path, html, status);
  out.commerce.push(row);
  if (status !== 200) out.issues.push(`${path} status ${status}`);
  if (!row.robots || !/noindex/.test(row.robots)) out.issues.push(`${path} missing noindex`);
}

const confirm = await request("/en/order-confirmation/ord_doesnotexist");
out.invalids.push({ path: "/en/order-confirmation/ord_doesnotexist", status: confirm.status });
if (confirm.status !== 404) out.issues.push("confirmation without access should 404");

for (const [path, expectStatus, expectLoc] of [
  ["/shop", 301, "/en/shop"],
  ["/checkout", 301, "/en/checkout"],
  ["/cart", 301, "/en/cart"],
  ["/af/afrekening", 301, "/af/betaal"],
  ["/af/shop", 301, "/af/winkel"],
]) {
  const { status, location } = await request(path);
  out.redirects.push({ path, status, location });
  if (status !== expectStatus || !String(location || "").endsWith(expectLoc)) {
    out.issues.push(`${path} -> ${status} ${location}, expected ${expectStatus} ${expectLoc}`);
  }
}

for (const path of ["/en/products/does-not-exist", "/zz"]) {
  const { status } = await request(path);
  out.invalids.push({ path, status });
  if (status !== 404) out.issues.push(`${path} expected 404 got ${status}`);
}

const light = await request("/en/products/baby-spinach", { cookie: "mm-theme=light" });
const dark = await request("/en/products/baby-spinach", { cookie: "mm-theme=dark" });
const lf = facts("light", light.html, light.status);
const df = facts("dark", dark.html, dark.status);
out.theme = {
  sameCanonical: lf.canonical === df.canonical,
  sameTitle: lf.title === df.title,
  sameJsonLd: JSON.stringify(lf.jsonLd) === JSON.stringify(df.jsonLd),
  lightTheme: pick(light.html, /data-theme="([^"]+)"/),
  darkTheme: pick(dark.html, /data-theme="([^"]+)"/),
};
if (!out.theme.sameCanonical || !out.theme.sameTitle || !out.theme.sameJsonLd) {
  out.issues.push("theme affected SEO fields");
}

const sitemap = await request("/sitemap.xml");
out.sitemap = {
  status: sitemap.status,
  locCount: (sitemap.html.match(/<loc>/g) || []).length,
  hasCart: sitemap.html.includes("/cart") || sitemap.html.includes("/mandjie"),
  hasCheckout: sitemap.html.includes("/checkout") || sitemap.html.includes("/betaal"),
  hasAdmin: sitemap.html.includes("/admin"),
};
if (out.sitemap.hasCart || out.sitemap.hasCheckout || out.sitemap.hasAdmin) {
  out.issues.push("sitemap includes commerce/admin URLs");
}

const product = out.pages.find((p) => p.path === "/en/products/baby-spinach");
const offer = JSON.stringify(product?.jsonLd || []);
if (!offer.includes("price") || !offer.includes("ZAR")) out.issues.push("product JSON-LD missing price/currency");

const robots = await request("/robots.txt");
out.robots = robots.html.trim();

console.log(JSON.stringify(out, null, 2));
console.log("ISSUE_COUNT", out.issues.length);
