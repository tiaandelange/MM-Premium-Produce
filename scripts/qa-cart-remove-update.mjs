const base = process.env.AUDIT_BASE || "http://localhost:3012";

const cartValue = encodeURIComponent(
  JSON.stringify({ v: 1, items: [{ productId: "prod_baby_spinach", variantId: null, quantity: 1 }] }),
);

function cookieForCart(value) {
  return `mm-cart=${value}`;
}

async function request(path, { method = "GET", body, cookie, headers = {}, redirect = "manual" } = {}) {
  const res = await fetch(base + path, {
    method,
    redirect,
    headers: {
      ...(cookie ? { cookie } : {}),
      ...headers,
      ...(body instanceof URLSearchParams ? { "content-type": "application/x-www-form-urlencoded" } : {}),
    },
    body,
  });
  const html = res.status === 200 || res.status === 404 ? await res.text() : "";
  const setCookies = (res.headers.getSetCookie?.() || []).map((c) => c.split(";")[0]);
  return { status: res.status, location: res.headers.get("location"), html, setCookies };
}

function extractMmCart(setCookies) {
  const mm = setCookies.find((c) => c.startsWith("mm-cart="));
  return mm ? mm.split("=", 2)[1] : null;
}

const start = await request("/en/cart", { cookie: cookieForCart(cartValue) });
const update = await request("/api/cart", {
  method: "POST",
  cookie: cookieForCart(cartValue),
  headers: { referer: base + "/en/cart" },
  body: new URLSearchParams({
    locale: "en",
    intent: "update",
    productId: "prod_baby_spinach",
    quantity: "2",
  }),
});

const cartAfterUpdateValue = extractMmCart(update.setCookies) ?? cartValue;
const afterUpdate = await request("/en/cart", { cookie: cookieForCart(cartAfterUpdateValue) });

const remove = await request("/api/cart", {
  method: "POST",
  cookie: cookieForCart(cartAfterUpdateValue),
  headers: { referer: base + "/en/cart" },
  body: new URLSearchParams({
    locale: "en",
    intent: "remove",
    productId: "prod_baby_spinach",
    quantity: "0",
  }),
});

const cartAfterRemoveValue = extractMmCart(remove.setCookies) ?? cartAfterUpdateValue;
const afterRemove = await request("/en/cart", { cookie: cookieForCart(cartAfterRemoveValue) });
const checkoutEmpty = await request("/en/checkout", { cookie: cookieForCart(cartAfterRemoveValue) });

console.log(
  JSON.stringify(
    {
      start: { status: start.status, hasBabySpinach: start.html.includes("Baby Spinach") },
      update: { status: update.status, location: update.location, setCookieCount: update.setCookies.length },
      afterUpdate: { status: afterUpdate.status, hasQty2: afterUpdate.html.includes("× 2") || afterUpdate.html.includes(">2<") },
      remove: { status: remove.status, location: remove.location, setCookieCount: remove.setCookies.length },
      afterRemove: { status: afterRemove.status, emptyCopy: afterRemove.html.includes("Your cart is empty") },
      checkoutEmpty: { status: checkoutEmpty.status, emptyCopy: checkoutEmpty.html.includes("Your cart is empty") },
    },
    null,
    2,
  ),
);

