import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  comparisonPricePer100g,
  parsePackMeasure,
  resolveDisplayPrice,
  sellingUnitForDisplay,
} from "../lib/catalog/price-display-model";
import { resolvePriceUnit } from "../lib/catalog/price-unit";

describe("parsePackMeasure", () => {
  it("parses gram and kilogram packs", () => {
    assert.deepEqual(parsePackMeasure("400 g"), { kind: "g", grams: 400 });
    assert.deepEqual(parsePackMeasure("1 kg"), { kind: "kg", kilograms: 1 });
    assert.deepEqual(parsePackMeasure("2 kg"), { kind: "kg", kilograms: 2 });
  });
});

describe("resolvePriceUnit", () => {
  it("does not label a 400g pack selling price as /100g", () => {
    assert.equal(
      resolvePriceUnit({ unit: "100g", packSize: "400 g", productId: "prod_cherry_tomatoes" }),
      "ea",
    );
  });

  it("keeps loose kg products as kg", () => {
    assert.equal(resolvePriceUnit({ unit: "kg", packSize: null, productId: "prod_carrots" }), "kg");
  });

  it("treats exact 1 kg packs as kg", () => {
    assert.equal(resolvePriceUnit({ packSize: "1 kg", productId: "prod_red_onion" }), "kg");
  });

  it("treats multi-kg packs as ea", () => {
    assert.equal(resolvePriceUnit({ packSize: "2 kg", productId: "prod_beetroot" }), "ea");
  });
});

describe("comparisonPricePer100g", () => {
  it("derives comparison from pack selling price", () => {
    const comparison = comparisonPricePer100g({ amount: 34.99, currency: "ZAR" }, "400 g");
    assert.ok(comparison);
    assert.equal(comparison.amount, 8.75);
    assert.equal(comparison.currency, "ZAR");
  });

  it("does not invent comparison without a price", () => {
    assert.equal(comparisonPricePer100g(null, "400 g"), null);
  });
});

describe("resolveDisplayPrice", () => {
  it("separates pack selling price from comparison", () => {
    const display = resolveDisplayPrice({
      price: { amount: 34.99, currency: "ZAR" },
      unit: "100g",
      packSize: "400 g",
      productId: "prod_cherry_tomatoes",
    });
    assert.equal(display.sellingUnit, "ea");
    assert.equal(sellingUnitForDisplay(display.sellingUnit, display.packLabel), null);
    assert.equal(display.comparisonPer100g?.amount, 8.75);
    assert.equal(display.priceConfirmed, true);
  });

  it("marks missing prices as unconfirmed", () => {
    const display = resolveDisplayPrice({ price: null, packSize: "200 g" });
    assert.equal(display.priceConfirmed, false);
    assert.equal(display.comparisonPer100g, null);
  });
});
