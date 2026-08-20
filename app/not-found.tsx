import { SiteShell } from "@/components/layout/site-shell";
import { EditorialEmptyState } from "@/components/layout/editorial-empty-state";
import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildNotFoundMetadata } from "@/lib/seo/indexation";
import Link from "next/link";

export const generateMetadata = buildNotFoundMetadata;

export default async function NotFound() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  return (
    <SiteShell locale={locale}>
      <div className="site-container py-20">
        <EditorialEmptyState
          title={messages.pageNotFound}
          action={
            <div className="flex flex-wrap gap-3">
              <Link href={paths.home} className="btn-primary">
                {messages.backHome}
              </Link>
              <Link href={paths.shop} className="btn-secondary">
                {messages.openShop}
              </Link>
            </div>
          }
        >
          <p>{messages.pageNotFound}</p>
        </EditorialEmptyState>
      </div>
    </SiteShell>
  );
}
