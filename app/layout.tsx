import { getSiteConfig } from "@/config/site";
import { buildRobots } from "@/lib/seo/indexation";
import type { Metadata } from "next";
import "./globals.css";

const site = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: site.defaultTitle,
    template: `%s | ${site.businessName}`,
  },
  description: site.defaultDescription,
  applicationName: site.businessName,
  robots: buildRobots(true),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: site.businessName,
    title: site.defaultTitle,
    description: site.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: site.defaultTitle,
    description: site.defaultDescription,
  },
  icons: {
    icon: "/brand/favicon.png",
    apple: "/brand/mm-premium-produce-logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.locale} className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
