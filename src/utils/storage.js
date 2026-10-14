// storage.js - keeps the cart in the browser (localStorage) so it
// survives a page refresh. This is the "browser state" in the plan.

const CART_KEY = "rt_cart";

export function loadCart() {
  try {
    const text = localStorage.getItem(CART_KEY);
    return text ? JSON.parse(text) : [];
  } catch (error) {
    return []; // blocked or broken storage: start with an empty cart
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    // storage blocked (private mode): the cart still works until refresh
  }
}
