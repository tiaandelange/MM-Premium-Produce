import { redirect } from "next/navigation";
import { z } from "zod";
import { requireLocale } from "@/lib/i18n/locale";
import { createPaths } from "@/lib/i18n/paths";
import { createOrderFromCart } from "@/services/orders";
import { isValidSaPhone, normalizeSaPhone } from "@/lib/commerce/phone";
import type { Route } from "next";

const checkoutSchema = z.object({
  locale: z.enum(["en", "af"]),
  customerFirstName: z.string().trim().min(1).max(80),
  customerLastName: z.string().trim().min(1).max(80),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(10).max(16),
  deliveryLine1: z.string().trim().min(3).max(200),
  deliverySuburb: z.string().trim().min(2).max(80),
  deliveryCity: z.string().trim().min(2).max(80),
  deliveryProvince: z.string().trim().min(2).max(80),
  deliveryPostalCode: z.string().trim().regex(/^\d{4}$/),
  deliveryNotes: z.string().trim().max(500).optional(),
  deliveryRuleId: z.string().trim().optional(),
  idempotencyKey: z.string().trim().min(8).max(80),
});

export async function submitCheckoutForm(formData: FormData): Promise<never> {
  const locale = requireLocale(String(formData.get("locale") || "en"));
  const paths = createPaths(locale);
  const phone = String(formData.get("customerPhone") || "");
  if (!isValidSaPhone(phone)) {
    redirect(`${paths.checkout}?error=invalidPhone` as Route);
  }
  const parsed = checkoutSchema.safeParse({
    locale,
    customerFirstName: formData.get("customerFirstName"),
    customerLastName: formData.get("customerLastName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: normalizeSaPhone(phone),
    deliveryLine1: formData.get("deliveryLine1"),
    deliverySuburb: formData.get("deliverySuburb"),
    deliveryCity: formData.get("deliveryCity"),
    deliveryProvince: formData.get("deliveryProvince"),
    deliveryPostalCode: formData.get("deliveryPostalCode"),
    deliveryNotes: String(formData.get("deliveryNotes") || "") || undefined,
    deliveryRuleId: String(formData.get("deliveryRuleId") || "") || undefined,
    idempotencyKey: formData.get("idempotencyKey"),
  });
  if (!parsed.success) {
    const emailIssue = parsed.error.issues.some((issue) => issue.path.includes("customerEmail"));
    redirect(`${paths.checkout}?error=${emailIssue ? "invalidEmail" : "validation"}` as Route);
  }
  const result = await createOrderFromCart(parsed.data);
  if (!result.ok) {
    redirect(`${paths.checkout}?error=${encodeURIComponent(result.errorKey)}` as Route);
  }
  redirect(paths.orderConfirmation(result.order.id));
}
