const base = process.env.AUDIT_BASE || "http://localhost:3007";
const cart = encodeURIComponent(
  JSON.stringify({ v: 1, items: [{ productId: "prod_baby_spinach", variantId: null, quantity: 1 }] }),
);

async function request(path, { method = "GET", body, cookie, redirect = "manual" } = {}) {
  const res = await fetch(base + path, {
    method,
    redirect,
    headers: { cookie, ...(body instanceof URLSearchParams ? { "content-type": "application/x-www-form-urlencoded" } : {}) },
    body,
  });
  const html = res.status === 200 || res.status === 404 ? await res.text() : "";
  const cookies = (res.headers.getSetCookie?.() || []).map((item) => item.split(";")[0]);
  return { status: res.status, location: res.headers.get("location"), html, cookies };
}

const checkout = await request("/en/checkout", { cookie: `mm-cart=${cart}` });
console.log("checkout", checkout.status, checkout.html.includes("Baby Spinach"), checkout.html.includes("First name"));

const placed = await request("/api/checkout", {
  method: "POST",
  cookie: `mm-cart=${cart}`,
  body: new URLSearchParams({
    locale: "en",
    idempotencyKey: crypto.randomUUID(),
    customerFirstName: "Test",
    customerLastName: "Customer",
    customerEmail: "phase3-test@example.com",
    customerPhone: "0821234567",
    deliveryLine1: "12 Test Street",
    deliverySuburb: "Observatory",
    deliveryCity: "Cape Town",
    deliveryProvince: "Western Cape",
    deliveryPostalCode: "7925",
  }),
});
console.log("place", placed.status, placed.location);

if (!placed.location) process.exit(1);
const confirmPath = placed.location.startsWith("http") ? new URL(placed.location).pathname : placed.location;
const confirmCookie = [...placed.cookies, `mm-cart=${cart}`].join("; ");
const confirm = await request(confirmPath, { cookie: confirmCookie });
console.log("confirm", confirm.status, /MM-\d+/.test(confirm.html), confirm.html.includes("Order confirmed"), confirm.html.includes("Baby Spinach"));
const stranger = await request(confirmPath);
console.log("stranger", stranger.status);

const duplicate = await request("/api/checkout", {
  method: "POST",
  cookie: `mm-cart=${cart}`,
  body: new URLSearchParams({
    locale: "en",
    idempotencyKey: "duplicate-phase3-key-test-0001",
    customerFirstName: "Test",
    customerLastName: "Customer",
    customerEmail: "phase3-test@example.com",
    customerPhone: "0821234567",
    deliveryLine1: "12 Test Street",
    deliverySuburb: "Observatory",
    deliveryCity: "Cape Town",
    deliveryProvince: "Western Cape",
    deliveryPostalCode: "7925",
  }),
});
const again = await request("/api/checkout", {
  method: "POST",
  cookie: `mm-cart=${cart}`,
  body: new URLSearchParams({
    locale: "en",
    idempotencyKey: "duplicate-phase3-key-test-0001",
    customerFirstName: "Test",
    customerLastName: "Customer",
    customerEmail: "phase3-test@example.com",
    customerPhone: "0821234567",
    deliveryLine1: "12 Test Street",
    deliverySuburb: "Observatory",
    deliveryCity: "Cape Town",
    deliveryProvince: "Western Cape",
    deliveryPostalCode: "7925",
  }),
});
console.log("idempotent", duplicate.location, again.location, duplicate.location === again.location);
