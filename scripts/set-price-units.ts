import { readFileSync } from "node:fs";
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
  const catalog = JSON.parse(readFileSync("data/catalog-products.json", "utf8")) as CatalogProduct[];
  const db = getDb();
  for (const product of catalog) {
    const unit = resolvePriceUnit({
      unit: product.unit,
      packSize: product.packSize,
      productId: product.id,
    });
    await db.update(products).set({ unit }).where(eq(products.id, product.id));
    console.log(product.id, unit);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
