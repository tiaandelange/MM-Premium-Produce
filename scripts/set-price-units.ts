import { readFileSync, writeFileSync } from "node:fs";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { products } from "@/db/schema";
import { resolvePriceUnit } from "@/lib/catalog/price-unit";

type CatalogProduct = {
  id: string;
  unit?: string;
  packSize?: string;
};

async function main() {
  const catalogPath = "data/catalog-products.json";
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8")) as CatalogProduct[];
  const db = getDb();
  for (const product of catalog) {
    const unit = resolvePriceUnit({
      packSize: product.packSize,
      productId: product.id,
    });
    product.unit = unit;
    await db.update(products).set({ unit }).where(eq(products.id, product.id));
    console.log(product.id, unit);
  }
  writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
