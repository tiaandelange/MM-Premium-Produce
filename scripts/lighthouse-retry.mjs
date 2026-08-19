import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const chrome =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.env.AUDIT_BASE || "http://localhost:3007";
const pages = [
  ["/af", "af-home"],
  ["/en/shop/fruit", "en-category"],
  ["/af/produkte/babaspinasie", "af-product"],
  ["/en/cart", "en-cart"],
];

mkdirSync("scripts/lighthouse", { recursive: true });
const summary = [];

for (const [path, name] of pages) {
  const outPath = `scripts/lighthouse/${name}.json`;
  spawnSync(
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
      "--quiet",
      "--chrome-path",
      chrome,
      "--chrome-flags=--headless --no-sandbox --disable-gpu",
    ],
    { stdio: "inherit", shell: false },
  );
  if (!existsSync(outPath)) {
    summary.push({ name, path, error: "missing report" });
    continue;
  }
  const report = JSON.parse(readFileSync(outPath, "utf8"));
  const audits = report.audits || {};
  const row = {
    name,
    path,
    score: Math.round((report.categories?.performance?.score ?? 0) * 100),
    lcp: audits["largest-contentful-paint"]?.numericValue,
    cls: audits["cumulative-layout-shift"]?.numericValue,
    tbt: audits["total-blocking-time"]?.numericValue,
    fcp: audits["first-contentful-paint"]?.numericValue,
    si: audits["speed-index"]?.numericValue,
  };
  summary.push(row);
  console.log(JSON.stringify(row));
}

writeFileSync("scripts/lighthouse/retry-summary.json", JSON.stringify(summary, null, 2));
console.log("RETRY_SUMMARY", JSON.stringify(summary, null, 2));
