/**
 * URL migrations. Once a public URL is indexed, add a redirect here
 * rather than silently changing the slug.
 */
import { shopifyRedirects, type RedirectRule } from "./seo/shopify-redirects";

export type { RedirectRule };

function dedupe(rules: RedirectRule[]): RedirectRule[] {
  const seen = new Set<string>();
  return rules.filter((rule) => {
    if (rule.from === rule.to) return false;
    if (seen.has(rule.from)) return false;
    seen.add(rule.from);
    return true;
  });
}

export const redirects: RedirectRule[] = dedupe(shopifyRedirects);
