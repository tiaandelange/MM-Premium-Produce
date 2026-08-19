import { cookies } from "next/headers";

export const CART_NOTICE_COOKIE = "mm-cart-notice";

export async function writeCartNotice(value: string): Promise<void> {
  const store = await cookies();
  store.set(CART_NOTICE_COOKIE, value, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 15,
  });
}

export async function readCartNotice(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_NOTICE_COOKIE)?.value ?? null;
}
