const html = await (await fetch("http://localhost:3021/en")).text();
const blocks = [...html.matchAll(/application\/ld\+json"[^>]*>([^<]+)/g)]
  .map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      return null;
    }
  })
  .filter(Boolean);
const org = blocks.find((b) => b["@type"] === "Organization");
console.log(JSON.stringify(org?.areaServed ?? null, null, 2));
