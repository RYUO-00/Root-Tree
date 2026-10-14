// ProductCard.jsx - one product in the catalogue grid.
import Pack from "./Pack.jsx";
import { formatPrice, lowestPrice } from "../utils/logic.js";

export default function ProductCard({ product, onOpen }) {
  return (
    <button className="product-card" onClick={() => onOpen(product.id)}>
      <div className="card-pic">
        <Pack product={product} size={96} />
      </div>
      <h3>{product.name}</h3>
      <span className="tag">{product.category}</span>
      <p>{product.tagline}</p>
      <span className="price">
        From {formatPrice(lowestPrice(product))} ({product.variants.length} options)
      </span>
    </button>
  );
}
