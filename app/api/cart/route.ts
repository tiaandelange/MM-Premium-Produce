import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireLocale } from "@/lib/i18n/locale";
import { createPaths } from "@/lib/i18n/paths";
import { addToCart, removeCartLine, updateCartQuantity } from "@/services/cart";
import { writeCartNotice } from "@/lib/commerce/cart-notice";

function safeRedirect(request: Request, locale: ReturnType<typeof requireLocale>) {
  const fallback = new URL(createPaths(locale).cart, request.url);
  const referer = request.headers.get("referer");
  if (!referer) return NextResponse.redirect(fallback, 303);
  try {
    const url = new URL(referer);
    if (url.origin !== fallback.origin) return NextResponse.redirect(fallback, 303);
    url.search = "";
    url.hash = "";
    return NextResponse.redirect(url, 303);
  } catch {
    return NextResponse.redirect(fallback, 303);
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = requireLocale(String(formData.get("locale") || "en"));
  const intent = String(formData.get("intent") || "add");
  const productId = String(formData.get("productId") || "");
  const variantId = String(formData.get("variantId") || "") || null;
  const quantity = Number(formData.get("quantity") || 1);

  if (intent === "remove") {
    await removeCartLine(productId, variantId);
  } else if (intent === "update") {
    const result = await updateCartQuantity({ productId, variantId, quantity, locale });
    if (!result.ok) await writeCartNotice(result.errorKey);
  } else {
    const result = await addToCart({ productId, variantId, quantity, locale });
    await writeCartNotice(result.ok ? "addedToCart" : result.errorKey);
  }

  revalidatePath("/", "layout");
  revalidatePath(createPaths(locale).cart);
  return safeRedirect(request, locale);
}
