import { writeFileSync } from "node:fs";

const base = process.env.AUDIT_BASE || "http://localhost:3006";

function decode(html) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function pick(html, re) {
  return (html.match(re) || [])[1] || null;
}

function all(html, re) {
  return [...html.matchAll(re)].map((m) => m.slice(1));
}

async function request(path, { redirect = "manual", headers = {}, cookie } = {}) {
  const res = await fetch(base + path, {
    redirect,
    headers: {
      ...headers,
      ...(cookie ? { cookie } : {}),
    },
  });
  const html = res.status === 200 || res.status === 404 ? await res.text() : "";
  return { res, html, status: res.status, location: res.headers.get("location") };
}

function analyze(path, status, html, location) {
  const title = decode(pick(html, /<title>([^<]+)<\/title>/) || "");
  const description = decode(pick(html, /name="description" content="([^"]*)"/) || "");
  const canonical = pick(html, /rel="canonical" href="([^"]+)"/);
  const lang = pick(html, /<html[^>]*lang="([^"]+)"/);
  const theme = pick(html, /data-theme="([^"]+)"/);
  const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g).map((m) => decode(m[0].replace(/<[^>]+>/g, "").trim()));
  const hreflangs = all(html, /rel="alternate"[^>]*hrefLang="([^"]+)"[^>]*href="([^"]+)"/g).map(
    ([langCode, href]) => ({ lang: langCode, href }),
  );
  if (!hreflangs.length) {
    hreflangs.push(
      ...all(html, /hrefLang="([^"]+)" href="([^"]+)"/g).map(([langCode, href]) => ({ lang: langCode, href })),
    );
  }
  const robots = pick(html, /name="robots" content="([^"]+)"/);
  const ogUrl = pick(html, /property="og:url" content="([^"]+)"/);
  const ogLocale = pick(html, /property="og:locale" content="([^"]+)"/);
  const ogTitle = decode(pick(html, /property="og:title" content="([^"]*)"/) || "");
  const jsonLd = all(html, /application\/ld\+json"[^>]*>([^<]+)/g).map((m) => {
    try {
      return JSON.parse(m[0]);
    } catch {
      return null;
    }
  }).filter(Boolean);
  const internal = all(html, /href="(\/(?:en|af)[^"]*)"/g).map((m) => m[0]);
  const crossNav = path.startsWith("/af")
    ? internal.filter((href) => /^\/en\/(shop|products|bundles|about|delivery|contact|faq)/.test(href))
    : [];
  const scripts = all(html, /<script\b/g).length;
  return {
    path,
    status,
    location,
    lang,
    theme,
    title,
    description,
    canonical,
    h1s,
    h1Count: h1s.length,
    hreflangs,
    robots,
    ogUrl,
    ogLocale,
    ogTitle,
    jsonLdTypes: jsonLd.flatMap((block) => (Array.isArray(block) ? block : [block]).map((item) => item["@type"])),
    jsonLd,
    scripts,
    htmlBytes: html.length,
    hasThemeToggle: html.includes("theme-toggle"),
    hasEN: html.includes(">EN<"),
    hasAF: html.includes(">AF<"),
    crossNav,
    productCount: (html.match(/\/(?:products|produkte)\//g) || []).length,
  };
}

const pages = [
  "/en",
  "/af",
  "/en/shop",
  "/af/winkel",
  "/en/shop/fruit",
  "/af/winkel/vrugte",
  "/en/shop/vegetables",
  "/af/winkel/groente",
  "/en/products/baby-spinach",
  "/af/produkte/babaspinasie",
  "/en/products/green-beans",
  "/af/produkte/groenbone",
  "/en/bundles",
  "/af/bokse",
  "/en/about",
  "/af/oor-ons",
  "/en/delivery",
  "/af/aflewering",
  "/en/contact",
  "/af/kontak",
  "/en/faq",
  "/af/gereelde-vrae",
];

const redirects = [
  "/",
  "/shop",
  "/products/baby-spinach",
  "/about",
  "/af/shop",
  "/af/products/baby-spinach",
];

const invalids = ["/de", "/en/products/does-not-exist", "/af/produkte/does-not-exist", "/en/shop/missing"];

const out = { pages: [], redirects: [], invalids: [], theme: [], sitemap: {}, robots: "", issues: [] };

for (const path of redirects) {
  const { status, location } = await request(path);
  out.redirects.push({ path, status, location });
}

for (const path of invalids) {
  const { status, html, location } = await request(path);
  out.invalids.push({ path, status, location, hasTitle: /<title>/.test(html) });
}

for (const path of pages) {
  const { status, html, location } = await request(path);
  out.pages.push(analyze(path, status, html, location));
}

const light = await request("/en/products/baby-spinach", { cookie: "mm-theme=light" });
const dark = await request("/en/products/baby-spinach", { cookie: "mm-theme=dark" });
const aLight = analyze("/en/products/baby-spinach", light.status, light.html);
const aDark = analyze("/en/products/baby-spinach", dark.status, dark.html);
out.theme.push({
  compare: "product en light vs dark",
  sameTitle: aLight.title === aDark.title,
  sameCanonical: aLight.canonical === aDark.canonical,
  sameH1: aLight.h1s[0] === aDark.h1s[0],
  sameJsonLd: JSON.stringify(aLight.jsonLd) === JSON.stringify(aDark.jsonLd),
  sameDescription: aLight.description === aDark.description,
  lightTheme: aLight.theme,
  darkTheme: aDark.theme,
});

const robots = await request("/robots.txt");
out.robots = robots.html;
const sitemap = await request("/sitemap.xml");
out.sitemap = {
  status: sitemap.status,
  bytes: sitemap.html.length,
  locCount: (sitemap.html.match(/<loc>/g) || []).length,
  hasAdmin: sitemap.html.includes("/admin"),
  hasCart: sitemap.html.includes("/cart"),
  hasCheckout: sitemap.html.includes("/checkout"),
  hasEnHome: sitemap.html.includes("/en</loc>") || sitemap.html.includes("/en<"),
  hasAfHome: sitemap.html.includes("/af</loc>") || sitemap.html.includes("/af<") || sitemap.html.includes("/af\""),
  hasAfProduct: sitemap.html.includes("/af/produkte/babaspinasie"),
  hasEnProduct: sitemap.html.includes("/en/products/baby-spinach"),
};

writeFileSync("scripts/seo-audit-out.json", JSON.stringify(out, null, 2));
const titles = {};
for (const p of out.pages) {
  titles[p.title] = (titles[p.title] || []).concat(p.path);
}
const descs = {};
for (const p of out.pages) {
  descs[p.description] = (descs[p.description] || []).concat(p.path);
}
console.log("redirects", JSON.stringify(out.redirects));
console.log("invalids", JSON.stringify(out.invalids));
console.log("theme", JSON.stringify(out.theme));
console.log("sitemap", JSON.stringify(out.sitemap));
console.log("robots", out.robots.replace(/\s+/g, " ").trim());
for (const p of out.pages) {
  console.log(
    [
      p.status,
      p.lang,
      `h1=${p.h1Count}`,
      p.hreflangs.map((h) => h.lang).join("+"),
      p.robots,
      `cross=${p.crossNav.length}`,
      p.jsonLdTypes.join("|"),
      p.path,
      p.title,
    ].join(" | "),
  );
}
console.log("dup titles", JSON.stringify(Object.entries(titles).filter(([, v]) => v.length > 1)));
console.log("dup descriptions", JSON.stringify(Object.entries(descs).filter(([, v]) => v.length > 1)));
console.log("missing title", out.pages.filter((p) => !p.title).map((p) => p.path));
console.log("missing desc", out.pages.filter((p) => !p.description).map((p) => p.path));
console.log("h1 issues", out.pages.filter((p) => p.h1Count !== 1).map((p) => [p.path, p.h1Count, p.h1s]));

