/**
 * Monthly organic growth loop.
 *
 * Reads optional Google Search Console CSV exports from data/seo/imports/.
 * Does not invent clicks, impressions, CTR or positions.
 *
 * Place files named:
 *   gsc-queries.csv   columns: Query, Clicks, Impressions, CTR, Position
 *   gsc-pages.csv     columns: Page, Clicks, Impressions, CTR, Position
 *
 * Then: npm run seo:monthly
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";

type QueryRow = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  language: "en" | "af" | "mixed";
};

function parseCsv(text: string): string[][] {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((cell) => cell.replace(/^"|"$/g, "").trim()))
    .filter((row) => row.some((cell) => cell.length));
}

function numberish(value: string): number {
  const cleaned = value.replace(/%/g, "").replace(/,/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function guessLanguage(query: string): QueryRow["language"] {
  const afHints =
    /\b(aartappel|wortel|groente|vrugte|spinasie|slaai|ui|tamat|aflewering|winkel)\w*/i;
  if (afHints.test(query)) return "af";
  return "en";
}

function loadQueries(file: string): QueryRow[] {
  if (!existsSync(file)) return [];
  const rows = parseCsv(readFileSync(file, "utf8"));
  const header = rows[0]?.map((cell) => cell.toLowerCase()) ?? [];
  const qi = header.findIndex((h) => h === "query" || h === "top queries");
  if (qi < 0) return [];
  const clicks = header.findIndex((h) => h.includes("click"));
  const impressions = header.findIndex((h) => h.includes("impression"));
  const ctr = header.findIndex((h) => h === "ctr");
  const position = header.findIndex((h) => h.includes("position"));
  return rows.slice(1).map((row) => {
    const query = row[qi] ?? "";
    return {
      query,
      clicks: clicks >= 0 ? numberish(row[clicks] ?? "0") : 0,
      impressions: impressions >= 0 ? numberish(row[impressions] ?? "0") : 0,
      ctr: ctr >= 0 ? numberish(row[ctr] ?? "0") : 0,
      position: position >= 0 ? numberish(row[position] ?? "0") : 0,
      language: guessLanguage(query),
    };
  });
}

function main() {
  const snapshotPath = path.join(process.cwd(), "data/seo/phase-6-snapshot.json");
  const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8")) as {
    origin: string;
    robots: string;
    database: { orders: number; paidOrders: number };
  };
  const importDir = path.join(process.cwd(), "data/seo/imports");
  const files = existsSync(importDir) ? readdirSync(importDir) : [];
  const queryFile = files.find((name) => name.toLowerCase().includes("quer"));
  const queries = queryFile ? loadQueries(path.join(importDir, queryFile)) : [];

  console.log("Origin:", snapshot.origin);
  console.log("GSC rows loaded:", queries.length);
  if (!queries.length) {
    console.log(
      "No Search Console export found. Add CSVs under data/seo/imports/ before ranking or CTR tests.",
    );
    console.log("Orders in Neon (all time):", snapshot.database.orders, "paid:", snapshot.database.paidOrders);
    console.log("Do not change titles, descriptions or slugs until query/page CSVs exist.");
    return;
  }

  const nearWin = queries.filter((row) => row.position >= 4 && row.position <= 30 && row.impressions >= 10);
  const ctrGaps = queries.filter((row) => row.impressions >= 50 && row.ctr < 2 && row.clicks < 5);
  console.log("Near-win queries (pos 4–30, impressions ≥ 10):", nearWin.length);
  console.log(nearWin.slice(0, 20));
  console.log("High impression / low CTR:", ctrGaps.length);
  console.log(ctrGaps.slice(0, 20));
}

main();
