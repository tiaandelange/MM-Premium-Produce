function trimTrailingSlash(value: string): string {
  if (value === "/") return value;
  return value.replace(/\/+$/, "");
}

function isLocalhostUrl(value: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(value);
}

function toHttpsOrigin(hostOrUrl: string): string {
  const trimmed = trimTrailingSlash(hostOrUrl.trim());
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed.replace(/^http:\/\//i, "https://");
  }
  return `https://${trimmed}`;
}

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const onVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

  if (onVercel) {
    if (fromEnv && !isLocalhostUrl(fromEnv)) {
      return trimTrailingSlash(fromEnv);
    }
    const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
    if (production) {
      return toHttpsOrigin(production);
    }
    const vercelUrl = process.env.VERCEL_URL?.trim();
    if (vercelUrl) {
      return toHttpsOrigin(vercelUrl);
    }
  }

  if (fromEnv) {
    return trimTrailingSlash(fromEnv);
  }

  return "http://localhost:3000";
}

/**
 * Production indexing must be opted into explicitly.
 * Local, preview and unverified deployments stay noindex.
 */
export function isIndexingEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") return false;
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return false;
  return true;
}

export function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}
