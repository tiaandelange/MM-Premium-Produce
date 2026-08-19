import { getMessages } from "@/lib/i18n/messages";
import { createPaths } from "@/lib/i18n/paths";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildNotFoundMetadata } from "@/lib/seo/indexation";
import Link from "next/link";

export const generateMetadata = buildNotFoundMetadata;

export default async function StorefrontNotFound() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const paths = createPaths(locale);
  return (
    <div className="site-container py-20">
      <h1 className="text-page-title">{messages.pageNotFound}</h1>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={paths.home} className="btn-primary">
          {messages.backHome}
        </Link>
        <Link href={paths.shop} className="btn-secondary">
          {messages.openShop}
        </Link>
      </div>
    </div>
  );
}
