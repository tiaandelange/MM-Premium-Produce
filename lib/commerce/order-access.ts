import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getAdminSession } from "@/lib/auth/session";

export const ORDER_ACCESS_COOKIE = "mm-order-access";
const MAX_AGE = 60 * 60 * 24 * 90;

type AccessPayload = {
  ids: string[];
};

function secret() {
  const value = process.env.AUTH_SECRET?.trim();
  if (!value) throw new Error("AUTH_SECRET is not set.");
  return new TextEncoder().encode(value);
}

async function readAccessIds(): Promise<string[]> {
  const store = await cookies();
  const token = store.get(ORDER_ACCESS_COOKIE)?.value;
  if (!token) return [];
  try {
    const { payload } = await jwtVerify(token, secret());
    const ids = Array.isArray(payload.ids) ? payload.ids.filter((id): id is string => typeof id === "string") : [];
    return ids.slice(-20);
  } catch {
    return [];
  }
}

export async function grantOrderAccess(orderId: string): Promise<void> {
  const ids = Array.from(new Set([...(await readAccessIds()), orderId])).slice(-20);
  const token = await new SignJWT({ ids } satisfies AccessPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  const store = await cookies();
  store.set(ORDER_ACCESS_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function canViewOrder(orderId: string): Promise<boolean> {
  const admin = await getAdminSession();
  if (admin?.role === "admin") return true;
  const ids = await readAccessIds();
  return ids.includes(orderId);
}
