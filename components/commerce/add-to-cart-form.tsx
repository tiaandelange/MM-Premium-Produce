"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { QuantitySelector } from "@/components/commerce/quantity-selector";
import { canPurchase } from "@/lib/commerce/availability";
import { analyticsEvents } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/client";
import { analyticsItemFromProduct } from "@/lib/analytics/items";
import { getMessages } from "@/lib/i18n/messages";
import type { Product } from "@/types/catalog";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {label}
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const messages = getMessages(product.locale);
  const variants = product.variants ?? [];
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const selected = variants.find((item) => item.id === variantId);
  const availability = selected?.availability ?? product.availability;
  const stock = selected?.stockQuantity ?? product.stockQuantity;
  const purchasable = canPurchase(availability, stock) && Boolean(product.price || selected?.price);
  const max = stock === null ? 20 : Math.min(20, Math.max(0, stock));

  if (!purchasable || max === 0) {
    return (
      <p className="btn-disabled inline-flex" aria-disabled="true">
        {messages.soldOut}
      </p>
    );
  }

  return (
    <form
      action="/api/cart"
      method="post"
      className="space-y-4"
      onSubmit={(event) => {
        const form = event.currentTarget;
        const quantity = Number(new FormData(form).get("quantity") || 1);
        const item = analyticsItemFromProduct(product, selected, Number.isFinite(quantity) ? quantity : 1);
        trackEvent(analyticsEvents.addToCart, {
          currency: item.price !== undefined ? (selected?.price ?? product.price)?.currency ?? "ZAR" : "ZAR",
          value: (item.price ?? 0) * (item.quantity ?? 1),
          items: [item],
        });
      }}
    >
      <input type="hidden" name="intent" value="add" />
      <input type="hidden" name="locale" value={product.locale} />
      <input type="hidden" name="productId" value={product.id} />
      {variants.length ? (
        <label className="block space-y-1">
          <span className="text-sm font-medium text-ink">{messages.chooseOption}</span>
          <select
            name="variantId"
            value={variantId}
            onChange={(event) => setVariantId(event.target.value)}
            className="field-control w-full"
          >
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id} disabled={variant.availability === "out_of_stock"}>
                {variant.name}
                {variant.packSize ? ` · ${variant.packSize}` : ""}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <QuantitySelector label={messages.quantity} max={max} />
      <SubmitButton label={messages.addToCart} />
    </form>
  );
}

export const AddToCartForm = AddToCart;
