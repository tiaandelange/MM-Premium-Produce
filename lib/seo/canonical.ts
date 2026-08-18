import { getSiteConfig } from "@/config/site";

function trimTrailingSlash(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

function stripQueryAndHash(pathname: string): string {
  return pathname.split("#")[0].split("?")[0];
}

export function toPathname(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const url = new URL(path);
    return trimTrailingSlash(url.pathname) || "/";
  }

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return trimTrailingSlash(stripQueryAndHash(withLeadingSlash)) || "/";
}

export function buildCanonicalUrl(path = "/"): string {
  const { siteUrl } = getSiteConfig();
  const pathname = toPathname(path);
  return pathname === "/" ? `${siteUrl}/` : `${siteUrl}${pathname}`;
}

export function buildCanonicalPath(path = "/"): string {
  return toPathname(path);
}
