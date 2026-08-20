const base = process.env.AUDIT_BASE || "http://localhost:3012";

const cart = encodeURIComponent(
  JSON.stringify({ v: 1, items: [{ productId: "prod_baby_spinach", variantId: null, quantity: 1 }] }),
);

async function request(path, { method = "GET", body, cookie, redirect = "manual", headers = {} } = {}) {
  const res = await fetch(base + path, {
    method,
    redirect,
    headers: { ...(cookie ? { cookie } : {}), ...headers, ...(body instanceof URLSearchParams ? { "content-type": "application/x-www-form-urlencoded" } : {}) },
    body,
  });
  const html = res.status === 200 || res.status === 404 ? await res.text() : "";
  const cookies = (res.headers.getSetCookie?.() || []).map((item) => item.split(";")[0]);
  return { res, html, cookies, location: res.headers.get("location") };
}

// 1) Load checkout page to ensure it renders.
await request("/en/checkout", { cookie: "mm-cart=" + cart });

// 2) Place an order via the checkout API (creates order + grants order access cookie).
const placed = await request("/api/checkout", {
  method: "POST",
  cookie: "mm-cart=" + cart,
  body: new URLSearchParams({
    locale: "en",
    idempotencyKey: crypto.randomUUID(),
    customerFirstName: "Test",
    customerLastName: "Customer",
    customerEmail: "order-confirm-lang-test@example.com",
    customerPhone: "0821234567",
    deliveryLine1: "12 Test Street",
    deliverySuburb: "Observatory",
    deliveryCity: "Cape Town",
    deliveryProvince: "Western Cape",
    deliveryPostalCode: "7925",
  }),
});

if (!placed.location) throw new Error("Missing order confirmation location");
const confirmPath = placed.location.startsWith("http") ? new URL(placed.location).pathname : placed.location;

// 3) Fetch the confirmation page using the granted order-access cookie(s).
const confirmCookie = [...placed.cookies, "mm-cart=" + cart].join("; ");
const confirm = await request(confirmPath, { cookie: confirmCookie });

const lang = (confirm.html.match(/<html[^>]*lang="([^"]+)"/) || [])[1] || null;

console.log(
  JSON.stringify(
    {
      placeStatus: placed.res.status,
      confirmStatus: confirm.res.status,
      lang,
      hasPageIntro: confirm.html.includes("page-intro"),
      hasEditorialPanel: confirm.html.includes("editorial-panel"),
      hasOrderConfirmed: confirm.html.includes("Order confirmed"),
    },
    null,
    2,
  ),
);

