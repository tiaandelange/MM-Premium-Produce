import Link from "next/link";
import { cartCount } from "@/services/cart";
import { createPaths } from "@/lib/i18n/paths";
import { getMessages } from "@/lib/i18n/messages";
import type { AppLocale } from "@/lib/i18n/config";

export async function CartLink({ locale }: { locale: AppLocale }) {
  const count = await cartCount();
  const paths = createPaths(locale);
  const messages = getMessages(locale);
  return (
    <Link
      href={paths.cart}
      className="relative flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-line bg-surface px-3 text-sm font-medium text-ink"
    >
      {messages.cart}
      {count ? (
        <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-leaf px-1.5 text-xs text-brand-fg">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
