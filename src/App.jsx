// App.jsx - the top-level component. It owns the shared state:
//   view      = which page is showing (home / shop / product / cart)
//   productId = which product is open
//   category  = the shop filter
//   cart      = the shopping cart (saved in localStorage)
import { useState, useEffect } from "react";
import { PRODUCTS } from "./data/products.js";
import { findProduct, addToCart, changeQty, removeLine, cartCount } from "./utils/logic.js";
import { loadCart, saveCart } from "./utils/storage.js";
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import Catalogue from "./components/Catalogue.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import Cart from "./components/Cart.jsx";

export default function App() {
  const [view, setView] = useState("home");
  const [productId, setProductId] = useState(null);
  const [category, setCategory] = useState("");
  const [cart, setCart] = useState(loadCart); // start from the saved cart

  // Save the cart every time it changes
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  function navigate(name) {
    if (name === "shop") setCategory("");
    setView(name);
    window.scrollTo(0, 0);
  }

  function openShop(categoryName) {
    setCategory(categoryName);
    setView("shop");
    window.scrollTo(0, 0);
  }

  function openProduct(id) {
    setProductId(id);
    setView("product");
    window.scrollTo(0, 0);
  }

  const product = findProduct(PRODUCTS, productId);

  return (
    <>
      <Header view={view} cartItems={cartCount(cart)} onNavigate={navigate} />

      {view === "home" && <Home onOpenShop={openShop} onOpenProduct={openProduct} />}

      {view === "shop" && (
        <Catalogue category={category} onCategoryChange={setCategory} onOpen={openProduct} />
      )}

      {view === "product" && product && (
        <ProductDetail
          key={product.id}
          product={product}
          onAdd={(variantId, qty) => setCart(addToCart(cart, variantId, qty))}
          onBack={() => openShop("")}
          onGoToCart={() => navigate("cart")}
        />
      )}

      {view === "cart" && (
        <Cart
          cart={cart}
          onChangeQty={(variantId, step) => setCart(changeQty(cart, variantId, step))}
          onRemove={(variantId) => setCart(removeLine(cart, variantId))}
          onClear={() => setCart([])}
          onShop={() => openShop("")}
        />
      )}
    </>
  );
}
