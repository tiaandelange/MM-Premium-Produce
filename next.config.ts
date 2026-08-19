import type { NextConfig } from "next";
import { redirects as redirectRules } from "./data/redirects";

const nextConfig: NextConfig = {
  trailingSlash: false,
  typedRoutes: true,
  async rewrites() {
    return [{ source: "/feeds/google-merchant.tsv", destination: "/feeds/google-merchant" }];
  },
  async redirects() {
    return redirectRules.map((rule) => ({
      source: rule.from,
      destination: rule.to,
      permanent: rule.permanent,
    }));
  },
};

export default nextConfig;
