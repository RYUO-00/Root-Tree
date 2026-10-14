// tests/logic.test.js - run with:  npm test
// Uses the test runner built into Node.js (no extra libraries).
import test from "node:test";
import assert from "node:assert";
import { PRODUCTS } from "../src/data/products.js";
import {
  sizeLabel, pricePer100, lowestPrice, findProduct, findForm, getVariantsForForm,
  getCategories, filterProducts, addToCart, changeQty, removeLine, cartLines,
  cartCount, cartSubtotal, deliveryFee,
} from "../src/utils/logic.js";

// ---- data checks ----
test("every product has forms and variants", () => {
  for (const p of PRODUCTS) assert.ok(p.forms.length > 0 && p.variants.length > 0, p.id);
});
test("every variant points to a real form", () => {
  for (const p of PRODUCTS) for (const v of p.variants) assert.ok(findForm(p, v.formId), v.id);
});
test("variant ids are unique across the catalogue", () => {
  const seen = new Set();
  for (const p of PRODUCTS) for (const v of p.variants) {
    assert.ok(!seen.has(v.id), "duplicate " + v.id);
    seen.add(v.id);
  }
});
test("every product has a pack type of pouch or bottle", () => {
  for (const p of PRODUCTS) assert.ok(["pouch", "bottle"].includes(p.pack), p.id);
});

// ---- price and size ----
test("sizeLabel shows 1000 g as 1 kg, 250 ml as 250 ml, 1000 ml as 1 L", () => {
  assert.strictEqual(sizeLabel({ amount: 1000, unit: "g" }), "1 kg");
  assert.strictEqual(sizeLabel({ amount: 250, unit: "ml" }), "250 ml");
  assert.strictEqual(sizeLabel({ amount: 1000, unit: "ml" }), "1 L");
});
test("pricePer100: Rs 220 for 500 g is Rs 44 per 100 g", () => {
  assert.strictEqual(pricePer100({ price: 220, amount: 500 }), 44);
});
test("lowestPrice of ragi is 95", () => {
  assert.strictEqual(lowestPrice(findProduct(PRODUCTS, "ragi")), 95);
});

// ---- catalogue ----
test("6 categories, one per product", () => {
  assert.strictEqual(getCategories(PRODUCTS).length, 6);
});
test("no filters returns all products", () => {
  assert.strictEqual(filterProducts(PRODUCTS, "", "").length, PRODUCTS.length);
});
test("category filter returns only that category", () => {
  const list = filterProducts(PRODUCTS, "Oils", "");
  assert.deepStrictEqual(list.map((p) => p.id), ["coconut-oil"]);
});
test("search is not case sensitive", () => {
  assert.strictEqual(filterProducts(PRODUCTS, "", "RAGI").length, 1);
});
test("unknown search returns an empty list", () => {
  assert.strictEqual(filterProducts(PRODUCTS, "", "xyz123").length, 0);
});

// ---- variants ----
test("sprouted ragi has 3 sizes, raw ragi has 2", () => {
  const ragi = findProduct(PRODUCTS, "ragi");
  assert.strictEqual(getVariantsForForm(ragi, "sprouted").length, 3);
  assert.strictEqual(getVariantsForForm(ragi, "raw").length, 2);
});
test("findProduct returns null for a bad id", () => {
  assert.strictEqual(findProduct(PRODUCTS, "nope"), null);
});

// ---- cart ----
test("addToCart adds quantities for the same variant and does not change the old cart", () => {
  const start = [];
  const one = addToCart(start, "ragi-raw-500", 1);
  const two = addToCart(one, "ragi-raw-500", 2);
  assert.deepStrictEqual(two, [{ variantId: "ragi-raw-500", qty: 3 }]);
  assert.deepStrictEqual(start, []);
});
test("changeQty +1 and -1 work, and a line at 0 is removed", () => {
  let cart = [{ variantId: "tur-100", qty: 1 }];
  cart = changeQty(cart, "tur-100", 1);
  assert.strictEqual(cart[0].qty, 2);
  cart = changeQty(cart, "tur-100", -1);
  cart = changeQty(cart, "tur-100", -1);
  assert.strictEqual(cart.length, 0);
});
test("removeLine removes only that line", () => {
  const cart = [{ variantId: "a", qty: 1 }, { variantId: "b", qty: 1 }];
  assert.deepStrictEqual(removeLine(cart, "a"), [{ variantId: "b", qty: 1 }]);
});
test("subtotal = price x quantity for every line", () => {
  const cart = [{ variantId: "ragi-sprouted-500", qty: 2 }, { variantId: "tur-100", qty: 1 }];
  assert.strictEqual(cartSubtotal(cartLines(cart, PRODUCTS)), 220 * 2 + 90);
});
test("cartCount adds up all quantities", () => {
  assert.strictEqual(cartCount([{ variantId: "a", qty: 2 }, { variantId: "b", qty: 3 }]), 5);
});
test("unknown variant ids are ignored", () => {
  assert.strictEqual(cartLines([{ variantId: "gone", qty: 1 }], PRODUCTS).length, 0);
});
test("delivery fee: 0 for empty, 40 below 499, free at 499", () => {
  assert.strictEqual(deliveryFee(0), 0);
  assert.strictEqual(deliveryFee(498), 40);
  assert.strictEqual(deliveryFee(499), 0);
});
