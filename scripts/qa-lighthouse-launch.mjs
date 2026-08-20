/**
 * Lighthouse mobile × 2 for launch QA pages (local production).
 * Usage: AUDIT_BASE=http://127.0.0.1:3011 node scripts/qa-lighthouse-launch.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean);
const chrome = chromeCandidates.find((p) => existsSync(p));
if (!chrome) {
  console.error("NO_CHROME");
  process.exit(2);
}

const base = (process.env.AUDIT_BASE || "http://127.0.0.1:3011").replace(/\/$/, "");
const pages = [
  ["/en", "launch-en-home"],
  ["/en/shop", "launch-en-shop"],
  ["/en/products/cherry-tomatoes", "launch-en-cherry"],
];

mkdirSync("scripts/lighthouse", { recursive: true });
const summary = [];

for (const [path, name] of pages) {
  const runs = [];
  for (let i = 1; i <= 2; i += 1) {
    const outPath = `scripts/lighthouse/${name}-run${i}.json`;
    const result = spawnSync(
      "npx",
      [
        "--yes",
        "lighthouse",
        `${base}${path}`,
        "--only-categories=performance,accessibility,best-practices,seo",
        "--form-factor=mobile",
        "--screenEmulation.mobile",
        "--chrome-path",
        chrome,
        "--output=json",
        `--output-path=${outPath}`,
        "--quiet",
        "--chrome-flags=--headless --no-sandbox --disable-gpu",
      ],
      { encoding: "utf8", shell: true, maxBuffer: 20 * 1024 * 1024 },
    );
    if (result.status !== 0) {
      runs.push({ run: i, error: result.stderr?.slice(0, 500) || result.stdout?.slice(0, 500) || "failed" });
      continue;
    }
    const json = JSON.parse(readFileSync(outPath, "utf8"));
    const cats = json.categories || {};
    const audits = json.audits || {};
    runs.push({
      run: i,
      performance: Math.round((cats.performance?.score ?? 0) * 100),
      accessibility: Math.round((cats.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((cats["best-practices"]?.score ?? 0) * 100),
      seo: Math.round((cats.seo?.score ?? 0) * 100),
      lcpMs: audits["largest-contentful-paint"]?.numericValue ?? null,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
      tbtMs: audits["total-blocking-time"]?.numericValue ?? null,
    });
  }
  const ok = runs.filter((r) => r.performance != null);
  const representative = ok.sort((a, b) => b.performance - a.performance)[0] || runs[0];
  summary.push({ path, name, base, environment: "local-production", runs, representative });
}

writeFileSync("scripts/lighthouse/launch-summary.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
