/**
 * Production / local smoke test for critical storefront routes.
 * Usage: node scripts/qa-smoke-deploy.mjs [baseUrl]
 * Checks HTTP status, expected H1/content markers, error boundary copy,
 * canonical and hreflang when present.
 */
const base = (process.argv[2] ?? "http://127.0.0.1:3000").replace(/\/$/, "");

const FAIL_MARKERS = [
  "Something went wrong",
  "Iets het verkeerd geloop",
  "Application error",
  "This page could not be found.",
];

const routes = [
  { path: "/en", expect: ["Fresh", "M & M", "Quality"] },
  { path: "/af", expect: ["Vars", "Kwaliteit", "M & M"] },
  { path: "/en/shop", expect: ["All produce", "Search", "Showing"] },
  { path: "/en/shop/fruit", expect: ["Fruit"] },
  { path: "/en/products/cherry-tomatoes", expect: ["Cherry Tomatoes", "400"] },
  { path: "/en/products/baby-spinach", expect: ["Baby Spinach", "200"] },
  { path: "/en/delivery", expect: ["Delivery", "South Africa"] },
  { path: "/af/aflewering", expect: ["Aflewering", "Suid-Afrika"] },
  { path: "/en/cart", expect: ["Cart", "cart"] },
  { path: "/en/checkout", expect: ["Checkout", "order"] },
  { path: "/af/betaal", expect: ["Betaal", "bestelling"] },
  { path: "/en/about", expect: ["About", "Premium Produce"] },
  { path: "/en/faq", expect: ["Frequently asked"] },
  { path: "/en/guides", expect: ["guides", "Guides"] },
  { path: "/en/recipes", expect: ["recipes", "Recipes"] },
  { path: "/en/contact", expect: ["Contact"] },
  { path: "/en/privacy", expect: ["Privacy"] },
  { path: "/en/products/this-product-does-not-exist-xyz", expect: null, status: 404 },
];

function hasAny(html, needles) {
  const lower = html.toLowerCase();
  return needles.some((needle) => lower.includes(String(needle).toLowerCase()));
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  return match?.[1] ?? null;
}

function extractHreflang(html) {
  const tags = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]*>/gi)].map((m) => m[0]);
  const langs = tags
    .map((tag) => {
      const lang = tag.match(/hreflang=["']([^"']+)["']/i)?.[1];
      const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
      return lang && href ? `${lang}:${href}` : null;
    })
    .filter(Boolean);
  return langs;
}

async function check(route) {
  const url = `${base}${route.path}`;
  const started = Date.now();
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { Accept: "text/html", "User-Agent": "mm-smoke-deploy/2.0" },
    });
    // Follow one redirect for locale aliases if needed.
    let finalRes = res;
    let html = "";
    if ([301, 302, 307, 308].includes(res.status) && res.headers.get("location")) {
      const nextUrl = new URL(res.headers.get("location"), base).toString();
      finalRes = await fetch(nextUrl, {
        redirect: "follow",
        headers: { Accept: "text/html", "User-Agent": "mm-smoke-deploy/2.0" },
      });
    }
    html = await finalRes.text();
    const expectedStatus = route.status ?? 200;
    const marker = FAIL_MARKERS.find((m) => html.includes(m));
    const contentOk = route.expect == null ? true : hasAny(html, route.expect);
    // For 404 pages, "page not found" is expected — don't treat as FAIL_MARKERS collision if status matches.
    const failMarkerBlocks = expectedStatus === 200 && Boolean(marker);
    const ok = finalRes.status === expectedStatus && contentOk && !failMarkerBlocks;
    return {
      path: route.path,
      status: finalRes.status,
      ms: Date.now() - started,
      ok,
      marker: failMarkerBlocks ? marker : null,
      contentOk,
      canonical: extractCanonical(html),
      hreflang: extractHreflang(html),
    };
  } catch (error) {
    return {
      path: route.path,
      status: 0,
      ms: Date.now() - started,
      ok: false,
      marker: String(error?.message ?? error),
      contentOk: false,
      canonical: null,
      hreflang: [],
    };
  }
}

const results = [];
for (const route of routes) {
  const result = await check(route);
  results.push(result);
  const flag = result.ok ? "PASS" : "FAIL";
  const extra = [
    result.marker ? `marker=${result.marker}` : null,
    !result.contentOk ? "missing-content" : null,
    result.canonical ? `canonical` : "no-canonical",
    result.hreflang.length ? `hreflang=${result.hreflang.length}` : "no-hreflang",
  ]
    .filter(Boolean)
    .join(" ");
  console.log(`${flag}  ${result.status}  ${String(result.ms).padStart(5)}ms  ${route.path}  ${extra}`);
}

const failed = results.filter((r) => !r.ok);
console.log("");
console.log(`Base: ${base}`);
console.log(`Passed: ${results.length - failed.length}/${results.length}`);
if (failed.length) process.exitCode = 1;
