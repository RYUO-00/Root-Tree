// Cart.jsx - the shopping cart: change quantities, remove, see totals.
import { useState } from "react";
import { PRODUCTS } from "../data/products.js";
import {
  cartLines, cartSubtotal, deliveryFee, formatPrice, sizeLabel, findForm,
} from "../utils/logic.js";

export default function Cart({ cart, onChangeQty, onRemove, onClear, onShop }) {
  const [ordered, setOrdered] = useState(false);

  const lines = cartLines(cart, PRODUCTS);
  const subtotal = cartSubtotal(lines);
  const fee = deliveryFee(subtotal);

  // Demo checkout: no payment, no server. Shows a message and empties the cart.
  function handleCheckout() {
    onClear();
    setOrdered(true);
  }

  if (ordered) {
    return (
      <main className="wrap">
        <h1 className="page-title">Thank you</h1>
        <div className="box">
          <p>This was a demo checkout, so no payment was taken and nothing will be shipped.</p>
          <p>In the next phase, orders will be saved by a backend and linked to payment.</p>
          <button className="btn" onClick={onShop}>Back to shop</button>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="wrap">
        <h1 className="page-title">Your cart</h1>
        <div className="box">
          <p>Your cart is empty.</p>
          <button className="btn" onClick={onShop}>Browse products</button>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap">
      <h1 className="page-title">Your cart</h1>
      <div className="box">
        {lines.map((l) => (
          <div className="cart-line" key={l.variant.id}>
            <div>
              <strong>{l.product.name}</strong><br />
              {findForm(l.product, l.variant.formId).label}, {sizeLabel(l.variant)} at {formatPrice(l.variant.price)}
            </div>
            <div className="qty">
              <button aria-label={"Decrease quantity of " + l.product.name} onClick={() => onChangeQty(l.variant.id, -1)}>-</button>
              <span>{l.qty}</span>
              <button aria-label={"Increase quantity of " + l.product.name} onClick={() => onChangeQty(l.variant.id, 1)}>+</button>
            </div>
            <div className="line-total">{formatPrice(l.lineTotal)}</div>
            <button className="link" onClick={() => onRemove(l.variant.id)}>Remove</button>
          </div>
        ))}

        <div className="totals">
          <p>Subtotal: {formatPrice(subtotal)}</p>
          <p>Delivery: {fee === 0 ? "Free" : formatPrice(fee)}</p>
          <p className="grand">Total: {formatPrice(subtotal + fee)}</p>
          <button className="btn" onClick={handleCheckout}>Checkout (demo)</button>
        </div>
      </div>
    </main>
  );
}
