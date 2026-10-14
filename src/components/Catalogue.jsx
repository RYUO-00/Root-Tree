// Catalogue.jsx - the shop page: category buttons, search and product grid.
import { useState } from "react";
import { PRODUCTS } from "../data/products.js";
import { getCategories, filterProducts } from "../utils/logic.js";
import ProductCard from "./ProductCard.jsx";

export default function Catalogue({ category, onCategoryChange, onOpen }) {
  const [search, setSearch] = useState("");
  const categories = getCategories(PRODUCTS);
  const list = filterProducts(PRODUCTS, category, search);

  return (
    <main className="wrap">
      <h1 className="page-title">Shop</h1>

      <div className="filters">
        <input
          type="search"
          placeholder="Search products, e.g. ragi"
          aria-label="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="chips" role="group" aria-label="Category">
        <button className="chip" aria-pressed={category === ""} onClick={() => onCategoryChange("")}>
          All
        </button>
        {categories.map((name) => (
          <button key={name} className="chip" aria-pressed={category === name} onClick={() => onCategoryChange(name)}>
            {name}
          </button>
        ))}
      </div>

      <p className="count" aria-live="polite">{list.length} of {PRODUCTS.length} products</p>

      <section className="grid">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={onOpen} />
        ))}
        {list.length === 0 && (
          <div className="empty">No products match. Clear the search or choose another category.</div>
        )}
      </section>
    </main>
  );
}
