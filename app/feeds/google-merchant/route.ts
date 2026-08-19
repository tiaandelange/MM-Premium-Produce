import { getCatalog } from "@/services/catalog";
import { buildMerchantFeedRows, renderMerchantFeedTsv } from "@/lib/merchant/feed";
import { secretsMatch } from "@/lib/commerce/offer";

export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.MERCHANT_FEED_SECRET?.trim();
  if (!secret) return false;
  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token") ?? "";
  const header = request.headers.get("authorization") ?? "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  return secretsMatch(queryToken, secret) || secretsMatch(bearer, secret);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return new Response("Merchant feed is gated. Set MERCHANT_FEED_SECRET and pass it as ?token= or Bearer.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }

  const catalog = await getCatalog("en");
  const products = await catalog.listProducts();
  const tsv = renderMerchantFeedTsv(buildMerchantFeedRows(products));

  return new Response(tsv, {
    status: 200,
    headers: {
      "content-type": "text/tab-separated-values; charset=utf-8",
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
    },
  });
}

export async function HEAD(request: Request) {
  return GET(request);
}
