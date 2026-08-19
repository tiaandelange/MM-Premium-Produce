import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean);

const chrome = chromeCandidates.find((path) => existsSync(path));
if (!chrome) {
  console.error("NO_CHROME");
  process.exit(2);
}

const base = process.env.AUDIT_BASE || "http://localhost:3007";
const pages = [
  ["/en", "en-home"],
  ["/af", "af-home"],
  ["/en/shop/fruit", "en-category"],
  ["/en/products/baby-spinach", "en-product"],
  ["/af/produkte/babaspinasie", "af-product"],
  ["/en/cart", "en-cart"],
  ["/en/checkout", "en-checkout"],
];

mkdirSync("scripts/lighthouse", { recursive: true });
const summary = [];

for (const [path, name] of pages) {
  const outPath = `scripts/lighthouse/${name}.json`;
  const result = spawnSync(
    "npx",
    [
      "--yes",
      "lighthouse",
      `${base}${path}`,
      "--only-categories=performance",
      "--form-factor=mobile",
      "--screenEmulation.mobile",
      "--output=json",
      `--output-path=${outPath}`,
      `--chrome-flags=--headless --no-sandbox --disable-gpu`,
      "--quiet",
      "--chrome-path",
      chrome,
    ],
    { stdio: "inherit", shell: true, env: { ...process.env, CHROME_PATH: chrome } },
  );
  if (result.status !== 0) {
    summary.push({ name, path, error: `lighthouse exit ${result.status}` });
    continue;
  }
  const report = JSON.parse(readFileSync(outPath, "utf8"));
  const audits = report.audits || {};
  summary.push({
    name,
    path,
    score: Math.round((report.categories?.performance?.score ?? 0) * 100),
    lcp: audits["largest-contentful-paint"]?.numericValue,
    cls: audits["cumulative-layout-shift"]?.numericValue,
    tbt: audits["total-blocking-time"]?.numericValue,
    fcp: audits["first-contentful-paint"]?.numericValue,
    si: audits["speed-index"]?.numericValue,
  });
  console.log(JSON.stringify(summary.at(-1)));
}

writeFileSync("scripts/lighthouse/summary.json", JSON.stringify(summary, null, 2));
console.log("SUMMARY", JSON.stringify(summary, null, 2));
