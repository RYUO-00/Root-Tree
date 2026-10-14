// logic.js - small pure functions (no React, no browser).
// They are easy to read and are unit tested in tests/logic.test.js.

// "Rs 220" style price text
export function formatPrice(amount) {
  return "\u20B9" + amount;
}

// Turns 500 g into "500 g" and 1000 g into "1 kg"
export function sizeLabel(variant) {
  if (variant.amount >= 1000) {
    const big = variant.amount / 1000;
    return big + (variant.unit === "g" ? " kg" : " L");
  }
  return variant.amount + " " + variant.unit;
}

// Price per 100 g (or 100 ml) so customers can compare sizes fairly
export function pricePer100(variant) {
  const value = (variant.price / variant.amount) * 100;
  return Math.round(value * 10) / 10; // one decimal place
}

// Cheapest variant of a product (shown as "From Rs X")
export function lowestPrice(product) {
  let lowest = product.variants[0].price;
  for (const v of product.variants) {
    if (v.price < lowest) lowest = v.price;
  }
  return lowest;
}

export function findProduct(products, id) {
  for (const p of products) {
    if (p.id === id) return p;
  }
  return null;
}

export function findForm(product, formId) {
  for (const f of product.forms) {
    if (f.id === formId) return f;
  }
  return null;
}

export function findVariant(product, variantId) {
  for (const v of product.variants) {
    if (v.id === variantId) return v;
  }
  return null;
}

// Only the sizes that belong to one form (e.g. sprouted sizes)
export function getVariantsForForm(product, formId) {
  return product.variants.filter((v) => v.formId === formId);
}

// Unique category names (for the filter buttons and home tiles)
export function getCategories(products) {
  const list = [];
  for (const p of products) {
    if (!list.includes(p.category)) list.push(p.category);
  }
  return list;
}

// Filter by category and search text. Pass "" to skip a filter.
export function filterProducts(products, category, searchText) {
  const text = searchText.toLowerCase().trim();
  return products.filter((p) => {
    const okCategory = category === "" || p.category === category;
    const words = (p.name + " " + p.tagline + " " + p.category).toLowerCase();
    const okText = text === "" || words.includes(text);
    return okCategory && okText;
  });
}

// ---------- Cart ----------
// A cart is a list like [{ variantId: "ragi-raw-500", qty: 2 }].
// Every function returns a NEW list (React needs this to notice changes).

export function addToCart(cart, variantId, qty) {
  const exists = cart.some((line) => line.variantId === variantId);
  if (exists) {
    return cart.map((line) =>
      line.variantId === variantId ? { ...line, qty: line.qty + qty } : line
    );
  }
  return [...cart, { variantId, qty }];
}

// Change a quantity by +1 or -1. A line that reaches 0 is removed.
export function changeQty(cart, variantId, step) {
  return cart
    .map((line) =>
      line.variantId === variantId ? { ...line, qty: line.qty + step } : line
    )
    .filter((line) => line.qty > 0);
}

export function removeLine(cart, variantId) {
  return cart.filter((line) => line.variantId !== variantId);
}

// Combine cart + product data into display lines
export function cartLines(cart, products) {
  const lines = [];
  for (const item of cart) {
    for (const product of products) {
      const variant = findVariant(product, item.variantId);
      if (variant) {
        lines.push({ product, variant, qty: item.qty, lineTotal: variant.price * item.qty });
      }
    }
  }
  return lines;
}

export function cartCount(cart) {
  let total = 0;
  for (const line of cart) total += line.qty;
  return total;
}

export function cartSubtotal(lines) {
  let total = 0;
  for (const line of lines) total += line.lineTotal;
  return total;
}

// Free delivery from Rs 499. Empty cart = no fee.
export const FREE_DELIVERY_FROM = 499;
export const DELIVERY_FEE = 40;
export function deliveryFee(subtotal) {
  if (subtotal === 0) return 0;
  if (subtotal >= FREE_DELIVERY_FROM) return 0;
  return DELIVERY_FEE;
}
