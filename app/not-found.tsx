import { SiteShell } from "@/components/layout/site-shell";
import { paths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Page not found",
  description: "This page is not in the M & M Premium Produce catalogue.",
  path: "/404",
  indexable: false,
  absoluteTitle: true,
});

export default function NotFound() {
  return (
    <SiteShell>
      <div className="site-container py-20">
        <h1 className="text-page-title">Page not found</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          That address is not a product, category or page in this catalogue. Use the
          links below to continue shopping.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={paths.home} className="btn-primary">
            Back to the homepage
          </Link>
          <Link href={paths.shop} className="btn-secondary">
            Open the fresh produce shop
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
