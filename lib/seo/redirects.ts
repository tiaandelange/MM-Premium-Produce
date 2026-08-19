import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { redirects } from "@/db/schema";
import { type AppLocale } from "@/lib/i18n/config";
import { createPaths } from "@/lib/i18n/paths";
import { toPathname } from "@/lib/seo/canonical";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import type { Route } from "next";

export type StoredRedirect = {
  fromPath: string;
  toPath: string;
  permanent: boolean;
};

export async function findRedirect(pathname: string): Promise<StoredRedirect | null> {
  const fromPath = toPathname(pathname);
  const db = getDb();
  const [row] = await db.select().from(redirects).where(eq(redirects.fromPath, fromPath)).limit(1);
  if (!row) return null;
  return { fromPath: row.fromPath, toPath: row.toPath, permanent: row.permanent };
}

export async function recordSlugRedirect(input: {
  fromPath: string;
  toPath: string;
  entityType: "product" | "category" | "bundle" | "collection" | "other";
  entityId: string;
}) {
  const fromPath = toPathname(input.fromPath);
  const toPath = toPathname(input.toPath);
  if (fromPath === toPath) return;

  const db = getDb();
  const existing = await db.select().from(redirects).where(eq(redirects.fromPath, fromPath)).limit(1);
  const row = {
    fromPath,
    toPath,
    permanent: true,
    entityType: input.entityType,
    entityId: input.entityId,
    updatedAt: new Date(),
  };

  if (existing[0]) {
    await db.update(redirects).set(row).where(eq(redirects.id, existing[0].id));
    return;
  }

  await db.insert(redirects).values({
    id: `redir_${fromPath.replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "")}`,
    ...row,
  });
}

export async function recordLocalizedSlugRedirect(input: {
  locale: AppLocale;
  kind: "product" | "category" | "bundle";
  oldSlug: string;
  newSlug: string;
  entityId: string;
}) {
  const paths = createPaths(input.locale);
  const pathFor = (slug: string) => {
    if (input.kind === "product") return paths.product(slug);
    if (input.kind === "category") return paths.category(slug);
    return paths.bundle(slug);
  };
  await recordSlugRedirect({
    fromPath: pathFor(input.oldSlug),
    toPath: pathFor(input.newSlug),
    entityType: input.kind,
    entityId: input.entityId,
  });
  if (input.locale === "en") {
    await recordSlugRedirect({
      fromPath: pathFor(input.oldSlug).replace(/^\/en/, "") || "/",
      toPath: pathFor(input.newSlug),
      entityType: input.kind,
      entityId: input.entityId,
    });
  }
}

export async function followStoredRedirect(pathname: string): Promise<never> {
  const fromPath = toPathname(pathname);
  const found = await findRedirect(fromPath);
  if (found) {
    if (found.permanent) permanentRedirect(found.toPath as Route);
    redirect(found.toPath as Route);
  }

  const localeSeg = fromPath.split("/").filter(Boolean)[0];
  if (localeSeg === "en") {
    const unprefixed = fromPath.replace(/^\/en/, "") || "/";
    const legacy =
      (await findRedirect(unprefixed)) ?? (await findRedirect(`/en${unprefixed}`));
    if (legacy) {
      if (legacy.permanent) permanentRedirect(legacy.toPath as Route);
      redirect(legacy.toPath as Route);
    }
  }

  return notFound();
}
