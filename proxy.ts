import { defaultLocale, isAppLocale, type AppLocale } from "@/lib/i18n/config";
import { ADMIN_SESSION_COOKIE, readSessionToken } from "@/lib/auth/session";
import {
  englishSegmentToRouteKey,
  publicPath,
  routeSegments,
  segmentToRouteKey,
  unprefixedStorefrontPrefixes,
} from "@/lib/i18n/paths";
import { NextRequest, NextResponse } from "next/server";

function prefersAfrikaans(header: string | null): boolean {
  if (!header) return false;
  const parts = header.split(",").map((part) => {
    const [tag, qValue] = part.trim().split(";q=");
    return { tag: tag.toLowerCase(), q: qValue ? Number(qValue) : 1 };
  });
  const af = parts.find((part) => part.tag === "af" || part.tag.startsWith("af-"));
  const en = parts.find((part) => part.tag === "en" || part.tag.startsWith("en-"));
  if (!af) return false;
  return !en || af.q > en.q;
}

function requestWithLocale(request: NextRequest, locale: AppLocale, pathname: string) {
  const headers = new Headers(request.headers);
  headers.set("x-mm-locale", locale);
  headers.set("x-mm-pathname", pathname);
  return NextResponse.next({ request: { headers } });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = token ? await readSessionToken(token) : null;
    if (!session || session.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      if (pathname !== "/admin") url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/opengraph-image" ||
    pathname === "/icon.png" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return requestWithLocale(request, defaultLocale, pathname);
  }

  if (pathname === "/") {
    const cookieValue = request.cookies.get("mm-locale")?.value;
    const locale = isAppLocale(cookieValue)
      ? cookieValue
      : prefersAfrikaans(request.headers.get("accept-language"))
        ? "af"
        : defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    const response = NextResponse.redirect(url, 307);
    if (!isAppLocale(cookieValue)) {
      response.cookies.set("mm-locale", locale, { path: "/", maxAge: 31536000, sameSite: "lax" });
    }
    return response;
  }

  const unprefixed = unprefixedStorefrontPrefixes.find(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (unprefixed) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/products" ? `/${defaultLocale}/shop` : `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url, 301);
  }

  const segments = pathname.split("/").filter(Boolean);
  const localeSeg = segments[0];
  if (!isAppLocale(localeSeg)) {
    return new NextResponse(null, { status: 404 });
  }

  const second = segments[1];
  const rest = segments.slice(2).join("/");

  if (localeSeg === "af" && second === "afrekening") {
    const url = request.nextUrl.clone();
    url.pathname = `/af/betaal${rest ? `/${rest}` : ""}`;
    return NextResponse.redirect(url, 301);
  }

  const publicKey = segmentToRouteKey(localeSeg, second);
  const internalKey = englishSegmentToRouteKey(second);

  if (localeSeg === "af" && internalKey && !publicKey) {
    if (!rest) {
      const url = request.nextUrl.clone();
      url.pathname = publicPath("af", internalKey === "products" ? "shop" : internalKey);
      return NextResponse.redirect(url, 301);
    }
    return requestWithLocale(request, localeSeg, pathname);
  }

  if (publicKey === "products" && !rest) {
    const url = request.nextUrl.clone();
    url.pathname = publicPath(localeSeg, "shop");
    return NextResponse.redirect(url, 301);
  }

  if (localeSeg === "af" && publicKey) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/${localeSeg}/${routeSegments.en[publicKey]}${rest ? `/${rest}` : ""}`;
    const headers = new Headers(request.headers);
    headers.set("x-mm-locale", localeSeg);
    headers.set("x-mm-pathname", pathname);
    return NextResponse.rewrite(rewriteUrl, { request: { headers } });
  }

  return requestWithLocale(request, localeSeg, pathname);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
