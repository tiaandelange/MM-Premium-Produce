"use server";

import { revalidatePath } from "next/cache";
import { requireLocale } from "@/lib/i18n/locale";
import { createPaths } from "@/lib/i18n/paths";
import { addToCart, removeCartLine, updateCartQuantity } from "@/services/cart";
import { writeCartNotice } from "@/lib/commerce/cart-notice";
import { submitCheckoutForm } from "@/lib/commerce/place-order";

function localeFromForm(formData: FormData) {
  return requireLocale(String(formData.get("locale") || "en"));
}

export async function addToCartAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const result = await addToCart({
    productId: String(formData.get("productId") || ""),
    variantId: String(formData.get("variantId") || "") || null,
    quantity: Number(formData.get("quantity") || 1),
    locale,
  });
  if (!result.ok) {
    await writeCartNotice(result.errorKey);
  } else {
    await writeCartNotice("addedToCart");
  }
  revalidatePath("/", "layout");
}

export async function updateCartAction(formData: FormData) {
  const locale = localeFromForm(formData);
  const result = await updateCartQuantity({
    productId: String(formData.get("productId") || ""),
    variantId: String(formData.get("variantId") || "") || null,
    quantity: Number(formData.get("quantity") || 0),
    locale,
  });
  if (!result.ok) await writeCartNotice(result.errorKey);
  revalidatePath("/", "layout");
  revalidatePath(createPaths(locale).cart);
}

export async function removeCartAction(formData: FormData) {
  const locale = localeFromForm(formData);
  await removeCartLine(String(formData.get("productId") || ""), String(formData.get("variantId") || "") || null);
  revalidatePath("/", "layout");
  revalidatePath(createPaths(locale).cart);
}

export async function placeOrderAction(formData: FormData) {
  await submitCheckoutForm(formData);
}
