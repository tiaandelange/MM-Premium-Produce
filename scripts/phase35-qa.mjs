const base = process.env.AUDIT_BASE || "http://localhost:3008";

async function request(path, { method = "GET", body, cookie, redirect = "manual" } = {}) {
  const res = await fetch(base + path, {
    method,
    redirect,
    headers: {
      cookie,
      ...(body instanceof URLSearchParams ? { "content-type": "application/x-www-form-urlencoded" } : {}),
    },
    body,
  });
  const html = res.status === 200 || res.status === 404 ? await res.text() : "";
  return { status: res.status, location: res.headers.get("location"), html };
}

const cart = encodeURIComponent(JSON.stringify({ v: 1, items: [{ productId: "prod_baby_spinach", variantId: null, quantity: 1 }] }));
const empty = await request("/en/checkout");
const afCheckout = await request("/af/betaal", { cookie: `mm-cart=${cart}` });
const tamper = await request("/api/checkout", {
  method: "POST",
  cookie: `mm-cart=${cart}`,
  body: new URLSearchParams({
    locale: "en",
    idempotencyKey: crypto.randomUUID(),
    customerFirstName: "Test",
    customerLastName: "Customer",
    customerEmail: "phase35-tamper@example.com",
    customerPhone: "0821234567",
    deliveryLine1: "12 Test Street",
    deliverySuburb: "Observatory",
    deliveryCity: "Cape Town",
    deliveryProvince: "Western Cape",
    deliveryPostalCode: "7925",
    totalAmount: "1.00",
    subtotalAmount: "1.00",
  }),
});
const overstock = await request("/api/cart", {
  method: "POST",
  cookie: `mm-cart=${cart}`,
  body: new URLSearchParams({
    locale: "en",
    intent: "update",
    productId: "prod_baby_spinach",
    quantity: "999",
  }),
});
const invalidLocale = await request("/zz");
const product = await request("/en/products/baby-spinach");
const sku = /"sku"\s*:\s*"([^"]+)"/.exec(product.html)?.[1];
const offerPrice = /"price"\s*:\s*"([^"]+)"/.exec(product.html)?.[1];

console.log(
  JSON.stringify(
    {
      emptyCheckout: { status: empty.status, emptyCopy: empty.html.includes("Your cart is empty") },
      afCheckout: {
        status: afCheckout.status,
        hasCheckoutEn: afCheckout.html.includes(">Checkout<"),
        hasBetaal: afCheckout.html.includes("Betaal") || afCheckout.html.includes("Plaas bestelling"),
        hasFirstNameEn: afCheckout.html.includes("First name"),
        hasVoornaam: afCheckout.html.includes("Voornaam"),
      },
      tamper: { status: tamper.status, location: tamper.location },
      overstock: { status: overstock.status, location: overstock.location },
      invalidLocale: invalidLocale.status,
      jsonLd: { sku, offerPrice },
    },
    null,
    2,
  ),
);
