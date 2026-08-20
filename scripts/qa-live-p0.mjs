/**
 * Deep live P0 verification — content, digests, canonical/hreflang.
 * Usage: node scripts/qa-live-p0.mjs [baseUrl]
 */
const base = (process.argv[2] ?? "https://mm-premium-produce.vercel.app").replace(/\/$/, "");

const HISTORICAL_DIGESTS = ["4266824602", "1426832316", "2271768228"];
const FAIL_MARKERS = ["Something went wrong", "Iets het verkeerd geloop", "Application error"];

const routes = [
  { path: "/en/products/cherry-tomatoes", expect: ["Cherry Tomatoes"], h1Hint: "Cherry" },
  { path: "/en/products/baby-spinach", expect: ["Baby Spinach"], h1Hint: "Spinach" },
  { path: "/en/products/apples", expect: ["Apple"], h1Hint: "Apple" },
  { path: "/en/products/carrots", expect: ["Carrot"], h1Hint: "Carrot" },
  { path: "/en/delivery", expect: ["Delivery", "South Africa"], h1Hint: "Delivery" },
  { path: "/af/aflewering", expect: ["Aflewering", "Suid-Afrika"], h1Hint: "Aflewering" },
  { path: "/en/checkout", expect: ["Checkout"], h1Hint: "Checkout" },
  { path: "/af/betaal", expect: ["Betaal"], h1Hint: "Betaal" },
];

function extractCanonical(html) {
  return (
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1] ||
    null
  );
}

function extractHreflang(html) {
  return [...html.matchAll(/hreflang=["']([^"']+)["']/gi)].map((m) => m[1]);
}

function extractH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : null;
}

const results = [];
for (const route of routes) {
  const url = `${base}${route.path}`;
  const res = await fetch(url, {
    redirect: "follow",
    headers: { Accept: "text/html", "User-Agent": "mm-live-p0/1.0" },
  });
  const html = await res.text();
  const failMarker = FAIL_MARKERS.find((m) => html.includes(m));
  const digestsFound = HISTORICAL_DIGESTS.filter((d) => html.includes(d));
  const h1 = extractH1(html);
  const contentOk = route.expect.every((needle) => html.toLowerCase().includes(needle.toLowerCase()));
  const ok = res.ok && !failMarker && digestsFound.length === 0 && contentOk;
  const row = {
    path: route.path,
    status: res.status,
    h1,
    contentOk,
    failMarker: failMarker ?? null,
    digestsFound,
    canonical: extractCanonical(html),
    hreflang: extractHreflang(html),
    ok,
  };
  results.push(row);
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${row.status}  ${route.path}\n` +
      `  h1: ${h1 ?? "(none)"}\n` +
      `  failMarker: ${row.failMarker}\n` +
      `  digests: ${digestsFound.join(",") || "none"}\n` +
      `  canonical: ${row.canonical}\n` +
      `  hreflang: ${row.hreflang.join(", ")}\n`,
  );
}

const failed = results.filter((r) => !r.ok);
console.log(`Live P0: ${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exitCode = 1;
