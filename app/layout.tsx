import { getSiteConfig } from "@/config/site";
import { getRequestLocale } from "@/lib/i18n/request";
import { localeMeta } from "@/lib/i18n/config";
import { buildRobots } from "@/lib/seo/indexation";
import { getThemePreference } from "@/lib/theme-server";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-source-sans",
});

const heading = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-fraunces",
});

const site = getSiteConfig();

export const dynamic = "force-dynamic";

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
    locale: "en_ZA",
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = await getThemePreference();
  const locale = await getRequestLocale();

  return (
    <html
      lang={localeMeta[locale].htmlLang}
      className={`${sans.variable} ${heading.variable} h-full antialiased`}
      data-theme={theme}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
