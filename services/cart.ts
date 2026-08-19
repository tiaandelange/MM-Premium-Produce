import { cartLineKey, readCartCookie, writeCartCookie, type CartCookieLine } from "@/lib/commerce/cart-cookie";
import { availabilityFromStock, canPurchase } from "@/lib/commerce/availability";
import { resolvePriceUnit } from "@/lib/catalog/price-unit";
import type { CommerceErrorKey } from "@/lib/commerce/status";
import { getCatalog } from "@/services/catalog";
import type { AppLocale } from "@/lib/i18n/config";
import type { Product } from "@/types/catalog";
import type { HydratedCart, HydratedCartLine } from "@/types/commerce";

function linePrice(product: Product, variantId: string | null) {
  const variant = variantId ? product.variants?.find((item) => item.id === variantId) : undefined;
  return variant?.price ?? product.price;
}

function resolveLine(product: Product, item: CartCookieLine): HydratedCartLine {
  const variant = item.variantId ? product.variants?.find((entry) => entry.id === item.variantId) : undefined;
  const requiresVariant = Boolean(product.variants?.length);
  const unitPrice = linePrice(product, item.variantId ?? null);
  const stock = variant?.stockQuantity ?? product.stockQuantity;
  const availability = variant
    ? availabilityFromStock(variant.availability, variant.stockQuantity ?? null)
    : availabilityFromStock(product.availability, product.stockQuantity);
  const maxQuantity = stock === null ? 99 : Math.max(0, stock);
  const purchasable = canPurchase(availability, stock);
  let errorKey: CommerceErrorKey | undefined;
  let errorValues: Record<string, string> | undefined;
  if (requiresVariant && !variant) {
    errorKey = "chooseValidOption";
  } else if (!purchasable || maxQuantity === 0) {
    errorKey = "productUnavailable";
  } else if (item.quantity > maxQuantity) {
    errorKey = "onlyCountAvailable";
    errorValues = { count: String(maxQuantity) };
  }
  const quantity = Math.max(1, Math.min(item.quantity, maxQuantity || item.quantity));
  const lineTotal = unitPrice ? { amount: unitPrice.amount * quantity, currency: unitPrice.currency } : null;
  return {
    key: cartLineKey(product.id, item.variantId),
    productId: product.id,
    variantId: item.variantId ?? null,
    slug: product.slug,
    name: product.name,
    variantName: variant?.name ?? null,
    sku: variant?.sku ?? product.sku,
    quantity,
    maxQuantity: maxQuantity || 0,
    unitPrice,
    lineTotal,
    priceUnit: resolvePriceUnit({
      unit: product.unit,
      packSize: variant?.packSize ?? product.packSize,
      productId: product.id,
    }),
    availability,
    image: variant?.image ?? product.primaryImage,
    errorKey,
    errorValues,
  };
}

export async function getHydratedCart(locale: AppLocale): Promise<HydratedCart> {
  const cookie = await readCartCookie();
  const catalog = await getCatalog(locale);
  const items: HydratedCartLine[] = [];
  for (const line of cookie.items) {
    const product = await catalog.getProductById(line.productId);
    if (!product || product.status !== "active") {
      items.push({
        key: cartLineKey(line.productId, line.variantId),
        productId: line.productId,
        variantId: line.variantId ?? null,
        slug: "",
        name: "",
        variantName: null,
        sku: "",
        quantity: line.quantity,
        maxQuantity: 0,
        unitPrice: null,
        lineTotal: null,
        priceUnit: "ea",
        availability: "out_of_stock",
        image: { src: "/images/catalog/tomatoes.svg", alt: "", width: 800, height: 800 },
        errorKey: "itemNotInCatalogue",
      });
      continue;
    }
    items.push(resolveLine(product, line));
  }
  const currency = items.find((item) => item.unitPrice)?.unitPrice?.currency ?? "ZAR";
  const subtotalAmount = items.reduce((sum, item) => sum + (item.errorKey ? 0 : item.lineTotal?.amount ?? 0), 0);
  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.length ? { amount: subtotalAmount, currency } : null,
    currency,
    hasErrors: items.some((item) => Boolean(item.errorKey) || !item.unitPrice),
  };
}

export async function addToCart(input: {
  productId: string;
  variantId?: string | null;
  quantity: number;
  locale: AppLocale;
}): Promise<{ ok: true } | { ok: false; errorKey: CommerceErrorKey; errorValues?: Record<string, string> }> {
  const catalog = await getCatalog(input.locale);
  const product = await catalog.getProductById(input.productId);
  if (!product || product.status !== "active") {
    return { ok: false, errorKey: "productNotFound" };
  }
  if (product.variants?.length && !input.variantId) {
    return { ok: false, errorKey: "chooseValidOption" };
  }
  const resolved = resolveLine(product, {
    productId: input.productId,
    variantId: input.variantId,
    quantity: input.quantity,
  });
  if (resolved.errorKey && resolved.maxQuantity === 0) {
    return { ok: false, errorKey: resolved.errorKey, errorValues: resolved.errorValues };
  }
  const cart = await readCartCookie();
  const key = cartLineKey(input.productId, input.variantId);
  const existing = cart.items.find((item) => cartLineKey(item.productId, item.variantId) === key);
  const nextQty = (existing?.quantity ?? 0) + input.quantity;
  if (resolved.maxQuantity && nextQty > resolved.maxQuantity) {
    return {
      ok: false,
      errorKey: "onlyCountAvailable",
      errorValues: { count: String(resolved.maxQuantity) },
    };
  }
  const nextItems = existing
    ? cart.items.map((item) =>
        cartLineKey(item.productId, item.variantId) === key ? { ...item, quantity: nextQty } : item,
      )
    : [...cart.items, { productId: input.productId, variantId: input.variantId ?? null, quantity: input.quantity }];
  await writeCartCookie({ v: 1, items: nextItems });
  return { ok: true };
}

export async function updateCartQuantity(input: {
  productId: string;
  variantId?: string | null;
  quantity: number;
  locale: AppLocale;
}): Promise<{ ok: true } | { ok: false; errorKey: CommerceErrorKey; errorValues?: Record<string, string> }> {
  if (input.quantity <= 0) {
    await removeCartLine(input.productId, input.variantId);
    return { ok: true };
  }
  const catalog = await getCatalog(input.locale);
  const product = await catalog.getProductById(input.productId);
  if (!product || product.status !== "active") {
    return { ok: false, errorKey: "itemNotInCatalogue" };
  }
  const resolved = resolveLine(product, {
    productId: input.productId,
    variantId: input.variantId,
    quantity: input.quantity,
  });
  if (resolved.errorKey && resolved.maxQuantity === 0) {
    return { ok: false, errorKey: resolved.errorKey, errorValues: resolved.errorValues };
  }
  if (resolved.maxQuantity && input.quantity > resolved.maxQuantity) {
    return {
      ok: false,
      errorKey: "onlyCountAvailable",
      errorValues: { count: String(resolved.maxQuantity) },
    };
  }
  const cart = await readCartCookie();
  const key = cartLineKey(input.productId, input.variantId);
  await writeCartCookie({
    v: 1,
    items: cart.items.map((item) =>
      cartLineKey(item.productId, item.variantId) === key ? { ...item, quantity: input.quantity } : item,
    ),
  });
  return { ok: true };
}

export async function removeCartLine(productId: string, variantId?: string | null): Promise<void> {
  const cart = await readCartCookie();
  const key = cartLineKey(productId, variantId);
  await writeCartCookie({
    v: 1,
    items: cart.items.filter((item) => cartLineKey(item.productId, item.variantId) !== key),
  });
}

export async function clearCart(): Promise<void> {
  await writeCartCookie({ v: 1, items: [] });
}

export async function cartCount(): Promise<number> {
  const cart = await readCartCookie();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
