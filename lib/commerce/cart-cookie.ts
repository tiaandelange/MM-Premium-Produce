import { cookies } from "next/headers";

export const CART_COOKIE = "mm-cart";

export type CartCookieLine = {
  productId: string;
  variantId?: string | null;
  quantity: number;
};

export type CartCookie = {
  v: 1;
  items: CartCookieLine[];
};

function parseCart(value: string | undefined): CartCookie {
  if (!value) return { v: 1, items: [] };
  try {
    const parsed = JSON.parse(value) as CartCookie;
    if (parsed?.v !== 1 || !Array.isArray(parsed.items)) return { v: 1, items: [] };
    return {
      v: 1,
      items: parsed.items
        .filter((item) => item && typeof item.productId === "string" && item.quantity > 0)
        .map((item) => ({
          productId: item.productId,
          variantId: item.variantId || null,
          quantity: Math.min(99, Math.floor(item.quantity)),
        })),
    };
  } catch {
    return { v: 1, items: [] };
  }
}

export async function readCartCookie(): Promise<CartCookie> {
  const store = await cookies();
  return parseCart(store.get(CART_COOKIE)?.value);
}

export async function writeCartCookie(cart: CartCookie): Promise<void> {
  const store = await cookies();
  const cleaned: CartCookie = {
    v: 1,
    items: cart.items.filter((item) => item.quantity > 0),
  };
  store.set(CART_COOKIE, JSON.stringify(cleaned), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function cartLineKey(productId: string, variantId?: string | null): string {
  return `${productId}::${variantId || ""}`;
}
