import type { AvailabilityStatus, CatalogImage, Money } from "@/types/catalog";
import type { AppLocale } from "@/lib/i18n/config";
import type { CommerceErrorKey } from "@/lib/commerce/status";

export type MerchantFeedProduct = {
  id: string;
  title: string;
  description: string;
  link: string;
  image_link: string;
  availability: "in_stock" | "out_of_stock" | "preorder" | "backorder";
  price: string;
  condition: "new";
  brand: string;
  gtin?: string;
  mpn?: string;
  google_product_category?: string;
  product_type?: string;
};

export type CartLineType = "product" | "bundle";

export type CartLineInput = {
  type: CartLineType;
  productId: string;
  variantId?: string | null;
  quantity: number;
};

export type HydratedCartLine = {
  key: string;
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantName: string | null;
  sku: string;
  quantity: number;
  maxQuantity: number;
  unitPrice: Money | null;
  lineTotal: Money | null;
  priceUnit: "ea" | "kg" | "100g";
  availability: AvailabilityStatus;
  image: CatalogImage;
  errorKey?: CommerceErrorKey;
  errorValues?: Record<string, string>;
};

export type HydratedCart = {
  items: HydratedCartLine[];
  itemCount: number;
  subtotal: Money | null;
  currency: string;
  hasErrors: boolean;
};

export type DeliveryRule = {
  id: string;
  name: string;
  suburb: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  fee: Money;
  minOrder: Money | null;
  freeDeliveryThreshold: Money | null;
  estimatedWindow: string | null;
  estimatedMinDays: number | null;
  estimatedMaxDays: number | null;
  published: boolean;
  sortOrder: number;
  notes: string | null;
};

export type CheckoutInput = {
  locale: AppLocale;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryLine1: string;
  deliverySuburb?: string;
  deliveryCity?: string;
  deliveryProvince?: string;
  deliveryPostalCode?: string;
  deliveryNotes?: string;
  deliveryRuleId?: string | null;
  idempotencyKey?: string;
};

export type OrderRecord = {
  id: string;
  number: string;
  locale: AppLocale;
  localeTag: string;
  customerName: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string | null;
  deliveryName: string;
  deliveryPhone: string | null;
  deliveryLine1: string;
  deliverySuburb: string | null;
  deliveryCity: string | null;
  deliveryProvince: string | null;
  deliveryPostalCode: string | null;
  deliveryNotes: string | null;
  deliveryWindowSnapshot: string | null;
  subtotalAmount: number;
  deliveryFeeAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  fulfilmentStatus: string;
  deliveryStatus: string;
  paymentProvider: string;
  paymentInstruction: string | null;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    skuSnapshot: string;
    nameSnapshot: string;
    variantNameSnapshot: string | null;
    quantity: number;
    unitPriceAmount: number;
    lineTotalAmount: number;
  }>;
};

export type OfferSnapshot = {
  price: Money | null;
  availability: AvailabilityStatus;
  url: string;
};
