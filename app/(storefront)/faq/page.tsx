import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { paths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbStructuredData } from "@/lib/seo/structured-data";
import Link from "next/link";

const breadcrumbItems = [
  { name: "Home", path: paths.home },
  { name: "FAQ", path: paths.faq },
];

export const metadata = buildMetadata({
  title: "Fresh Produce FAQ",
  description:
    "Answers about shopping fresh fruit and vegetables from M & M Premium Produce.",
  path: paths.faq,
});

const faqs = [
  {
    question: "What can I shop for?",
    answer: (
      <p>
        The shop is organised into{" "}
        <Link href={paths.category("fruit")}>fresh fruit</Link>,{" "}
        <Link href={paths.category("vegetables")}>fresh vegetables</Link> and{" "}
        <Link href={paths.bundles}>produce boxes</Link>. Each product has its own page.
      </p>
    ),
  },
  {
    question: "Do you deliver?",
    answer: (
      <p>
        Delivery areas and times have not been confirmed yet. They will be published on
        the <Link href={paths.delivery}>delivery page</Link> when they are available.
      </p>
    ),
  },
  {
    question: "How is pricing shown?",
    answer: (
      <p>
        Prices are shown in South African rand where a selling price is listed. If a
        product has no selling price yet, the page says so instead of inventing a
        figure. Availability is taken from the current catalogue.
      </p>
    ),
  },
];

export default function FaqPage() {
  return (
    <div className="site-container space-y-10 py-12">
      <JsonLd data={buildBreadcrumbStructuredData(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Frequently asked questions"
        description="Only questions we can answer with confirmed information are listed here."
      />
      <div className="max-w-3xl space-y-8">
        {faqs.map((item) => (
          <section key={item.question}>
            <h2 className="text-section-title">{item.question}</h2>
            <div className="mt-3 text-muted">{item.answer}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
