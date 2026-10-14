// Home.jsx - the landing page: branding, categories and featured products.
import { PRODUCTS } from "../data/products.js";
import { getCategories } from "../utils/logic.js";
import Pack from "./Pack.jsx";
import ProductCard from "./ProductCard.jsx";

export default function Home({ onOpenShop, onOpenProduct }) {
  const categories = getCategories(PRODUCTS);
  const featured = PRODUCTS.slice(0, 3);

  return (
    <main className="wrap">
      {/* Hero: the first thing the visitor sees */}
      <section className="hero">
        <div className="hero-text">
          <h1>Know what is in the jar before it is in your cart</h1>
          <p>
            Botanical foods from Bengaluru. Every product explains its forms,
            sizes, price per 100 g, traditional use and how to cook with it.
          </p>
          <button className="btn" onClick={() => onOpenShop("")}>Shop all products</button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <Pack product={PRODUCTS[1]} size={110} />
          <Pack product={PRODUCTS[0]} size={140} />
          <Pack product={PRODUCTS[2]} size={110} />
        </div>
      </section>

      {/* Categories: each one opens the shop with that filter on */}
      <h2>Shop by category</h2>
      <section className="category-row">
        {categories.map((name) => {
          const count = PRODUCTS.filter((p) => p.category === name).length;
          return (
            <button key={name} className="category-tile" onClick={() => onOpenShop(name)}>
              <strong>{name}</strong>
              <span>{count} {count === 1 ? "product" : "products"}</span>
            </button>
          );
        })}
      </section>

      {/* What makes the information clearer */}
      <section className="promises">
        <div><h3>Clear variants</h3><p>Raw or sprouted, 250 g or 1 kg: each choice is explained in one line.</p></div>
        <div><h3>Fair prices</h3><p>Every option shows the price per 100 g so you can compare sizes.</p></div>
        <div><h3>Know before you cook</h3><p>Benefits, traditional use, sourcing, how to use and storage on every page.</p></div>
      </section>

      <h2>Featured products</h2>
      <section className="grid">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={onOpenProduct} />
        ))}
      </section>
    </main>
  );
}
