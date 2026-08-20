/**
 * Post-deploy smoke test for critical storefront routes.
 * Usage: node scripts/qa-smoke-deploy.mjs [baseUrl]
 * Default base: https://mm-premium-produce.vercel.app
 */
const base = (process.argv[2] ?? "https://mm-premium-produce.vercel.app").replace(/\/$/, "");

const routes = [
  "/en",
  "/en/shop",
  "/en/products/cherry-tomatoes",
  "/en/delivery",
  "/en/cart",
  "/en/checkout",
  "/af",
  "/af/aflewering",
  "/af/betaal",
];

const FAIL_MARKERS = [
  "Something went wrong",
  "Iets het verkeerd geloop",
  "Application error",
];

async function check(path) {
  const url = `${base}${path}`;
  const started = Date.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { Accept: "text/html", "User-Agent": "mm-smoke-deploy/1.0" },
    });
    const html = await res.text();
    const marker = FAIL_MARKERS.find((m) => html.includes(m));
    const ok = res.ok && !marker;
    return {
      path,
      status: res.status,
      ms: Date.now() - started,
      ok,
      marker: marker ?? null,
    };
  } catch (error) {
    return {
      path,
      status: 0,
      ms: Date.now() - started,
      ok: false,
      marker: String(error?.message ?? error),
    };
  }
}

const results = [];
for (const path of routes) {
  const result = await check(path);
  results.push(result);
  const flag = result.ok ? "PASS" : "FAIL";
  console.log(`${flag}  ${result.status}  ${String(result.ms).padStart(5)}ms  ${path}${result.marker ? `  (${result.marker})` : ""}`);
}

const failed = results.filter((r) => !r.ok);
console.log("");
console.log(`Base: ${base}`);
console.log(`Passed: ${results.length - failed.length}/${results.length}`);
if (failed.length) {
  process.exitCode = 1;
}
