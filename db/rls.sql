-- Row-level security for the catalogue CMS.
-- The Next.js server connects as the database owner, which bypasses RLS
-- unless FORCE is enabled. FORCE is intentionally not applied so the
-- privileged server role can administer drafts. Policies below apply to
-- non-owner roles (future catalog_reader / authenticated clients).

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_products ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE customers, orders, order_items, payments, deliveries, delivery_rules FROM PUBLIC;
REVOKE INSERT, UPDATE, DELETE ON TABLE admin_users FROM PUBLIC;

DROP POLICY IF EXISTS products_public_read ON products;
DROP POLICY IF EXISTS categories_public_read ON categories;
DROP POLICY IF EXISTS collections_public_read ON collections;
DROP POLICY IF EXISTS product_images_public_read ON product_images;
DROP POLICY IF EXISTS product_variants_public_read ON product_variants;
DROP POLICY IF EXISTS product_categories_public_read ON product_categories;
DROP POLICY IF EXISTS collection_products_public_read ON collection_products;
DROP POLICY IF EXISTS bundles_public_read ON bundles;
DROP POLICY IF EXISTS bundle_items_public_read ON bundle_items;
DROP POLICY IF EXISTS bundle_images_public_read ON bundle_images;
DROP POLICY IF EXISTS inventory_public_read ON inventory;
DROP POLICY IF EXISTS product_translations_public_read ON product_translations;
DROP POLICY IF EXISTS category_translations_public_read ON category_translations;
DROP POLICY IF EXISTS bundle_translations_public_read ON bundle_translations;
DROP POLICY IF EXISTS collection_translations_public_read ON collection_translations;
DROP POLICY IF EXISTS redirects_public_read ON redirects;
DROP POLICY IF EXISTS delivery_rules_public_read ON delivery_rules;
DROP POLICY IF EXISTS media_public_read ON media_assets;

CREATE POLICY products_public_read ON products
  FOR SELECT TO PUBLIC
  USING (status = 'active');

CREATE POLICY categories_public_read ON categories
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY collections_public_read ON collections
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY product_images_public_read ON product_images
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY product_variants_public_read ON product_variants
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY product_categories_public_read ON product_categories
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY collection_products_public_read ON collection_products
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY bundles_public_read ON bundles
  FOR SELECT TO PUBLIC
  USING (status = 'active');

CREATE POLICY bundle_items_public_read ON bundle_items
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY bundle_images_public_read ON bundle_images
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY inventory_public_read ON inventory
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY product_translations_public_read ON product_translations
  FOR SELECT TO PUBLIC
  USING (status = 'published');

CREATE POLICY category_translations_public_read ON category_translations
  FOR SELECT TO PUBLIC
  USING (status = 'published');

CREATE POLICY bundle_translations_public_read ON bundle_translations
  FOR SELECT TO PUBLIC
  USING (status = 'published');

CREATE POLICY collection_translations_public_read ON collection_translations
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY redirects_public_read ON redirects
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY delivery_rules_public_read ON delivery_rules
  FOR SELECT TO PUBLIC
  USING (published = true);

CREATE POLICY media_public_read ON media_assets
  FOR SELECT TO PUBLIC
  USING (true);

DROP POLICY IF EXISTS articles_public_read ON articles;
DROP POLICY IF EXISTS article_translations_public_read ON article_translations;
DROP POLICY IF EXISTS article_products_public_read ON article_products;
DROP POLICY IF EXISTS article_categories_public_read ON article_categories;
DROP POLICY IF EXISTS recipes_public_read ON recipes;
DROP POLICY IF EXISTS recipe_translations_public_read ON recipe_translations;
DROP POLICY IF EXISTS recipe_products_public_read ON recipe_products;

CREATE POLICY articles_public_read ON articles
  FOR SELECT TO PUBLIC
  USING (status = 'active');

CREATE POLICY article_translations_public_read ON article_translations
  FOR SELECT TO PUBLIC
  USING (status = 'published');

CREATE POLICY article_products_public_read ON article_products
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY article_categories_public_read ON article_categories
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY recipes_public_read ON recipes
  FOR SELECT TO PUBLIC
  USING (status = 'active');

CREATE POLICY recipe_translations_public_read ON recipe_translations
  FOR SELECT TO PUBLIC
  USING (status = 'published');

CREATE POLICY recipe_products_public_read ON recipe_products
  FOR SELECT TO PUBLIC
  USING (true);
