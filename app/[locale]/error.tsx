"use client";

import { useEffect } from "react";
import Link from "next/link";
import { EditorialEmptyState } from "@/components/layout/editorial-empty-state";
import { usePathname } from "next/navigation";
import { defaultLocale, isAppLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const localeSeg = pathname?.split("/").filter(Boolean)[0];
  const locale = isAppLocale(localeSeg) ? localeSeg : defaultLocale;
  const messages = getMessages(locale);
  const paths = createPaths(locale);

  useEffect(() => {
    console.error("Storefront render error", {
      digest: error.digest,
      message: error.message,
      pathname,
    });
  }, [error, pathname]);

  return (
    <div className="site-container py-20">
      <EditorialEmptyState
        title={messages.somethingWentWrong}
        action={
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={() => reset()}>
              {messages.tryAgain}
            </button>
            <Link href={paths.shop} className="btn-secondary">
              {messages.openShop}
            </Link>
            <Link href={paths.home} className="btn-ghost">
              {messages.backHome}
            </Link>
          </div>
        }
      >
        <p>{messages.errorRecoveryHint}</p>
        {error.digest ? (
          <p className="mt-3 text-sm text-muted">
            {messages.errorReference}: <code>{error.digest}</code>
          </p>
        ) : null}
      </EditorialEmptyState>
    </div>
  );
}
