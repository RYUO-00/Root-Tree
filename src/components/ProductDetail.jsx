// ProductDetail.jsx - one product: variant selector, price, education tabs
// and the comparison table.
import { useState } from "react";
import Pack from "./Pack.jsx";
import {
  formatPrice, sizeLabel, pricePer100, findForm, findVariant,
  getVariantsForForm, FREE_DELIVERY_FROM,
} from "../utils/logic.js";

// The tabs shown under the buy box
const TABS = [
  { key: "overview", label: "What it is" },
  { key: "benefits", label: "Benefits" },
  { key: "traditional", label: "Traditional use" },
  { key: "sourcing", label: "Where it comes from" },
  { key: "usage", label: "How to use" },
  { key: "storage", label: "Storage and shelf life" },
];

// Turns a list of strings into a bullet list
function BulletList({ items }) {
  return (
    <ul>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default function ProductDetail({ product, onAdd, onBack, onGoToCart }) {
  // The page remembers four choices
  const [formId, setFormId] = useState(product.forms[0].id);
  const [variantId, setVariantId] = useState(getVariantsForForm(product, product.forms[0].id)[0].id);
  const [tab, setTab] = useState("overview");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const form = findForm(product, formId);
  const variant = findVariant(product, variantId);
  const sizes = getVariantsForForm(product, formId);

  // Choosing a form jumps to its first size, so the combination is always valid
  function chooseForm(id) {
    setFormId(id);
    setVariantId(getVariantsForForm(product, id)[0].id);
    setMessage("");
  }

  function changeQuantity(step) {
    const next = quantity + step;
    if (next >= 1 && next <= 20) setQuantity(next);
  }

  function handleAdd() {
    onAdd(variantId, quantity);
    setMessage("Added to cart.");
  }

  // What the selected tab shows
  function renderTab() {
    if (tab === "overview") {
      return (<><p>{product.summary}</p><p><strong>Ingredients:</strong> {product.ingredients}</p></>);
    }
    if (tab === "benefits") {
      return (<><BulletList items={product.benefits} /><p className="small-print">General food information, not medical advice.</p></>);
    }
    if (tab === "traditional") {
      return (<><p>{product.traditionalUse}</p><p className="small-print">Traditional uses are cultural knowledge, not medical claims.</p></>);
    }
    if (tab === "sourcing") return <p>{product.sourcing}</p>;
    if (tab === "usage") return <BulletList items={product.howToUse} />;
    return (<><p><strong>Storage:</strong> {product.storage}</p><p><strong>Shelf life:</strong> {product.shelfLife}</p></>);
  }

  return (
    <main className="wrap">
      <p className="crumb"><button className="link" onClick={onBack}>Shop</button> / {product.name}</p>

      <div className="detail">
        <div className="picture"><Pack product={product} size={150} /></div>

        <div>
          <h1>{product.name}</h1>
          <p>{product.tagline}</p>

          {/* Step 1: the form (only when there is a choice) */}
          {product.forms.length > 1 && (
            <>
              <p className="option-label">Form</p>
              <div className="options">
                {product.forms.map((f) => (
                  <button key={f.id} className="opt" aria-pressed={f.id === formId} onClick={() => chooseForm(f.id)}>
                    {f.label}
                  </button>
                ))}
              </div>
            </>
          )}
          <p className="form-note"><strong>{form.label}:</strong> {form.description} Best for: {form.bestFor}.</p>

          {/* Step 2: the size */}
          <p className="option-label">Size</p>
          <div className="options">
            {sizes.map((s) => (
              <button key={s.id} className="opt" aria-pressed={s.id === variantId} onClick={() => { setVariantId(s.id); setMessage(""); }}>
                {sizeLabel(s)}
              </button>
            ))}
          </div>

          {/* Price changes with the selection */}
          <p className="big-price">{formatPrice(variant.price)}</p>
          <p className="per-unit">{formatPrice(pricePer100(variant))} per 100 {variant.unit}. Inclusive of all taxes.</p>

          <div className="buy-row">
            <div className="qty">
              <button aria-label="Decrease quantity" onClick={() => changeQuantity(-1)}>-</button>
              <span>{quantity}</span>
              <button aria-label="Increase quantity" onClick={() => changeQuantity(1)}>+</button>
            </div>
            <button className="btn" onClick={handleAdd}>Add to cart</button>
            <button className="btn secondary" onClick={onGoToCart}>View cart</button>
          </div>
          <p className="status" aria-live="polite">{message}</p>

          <div className="delivery">
            Ships from our Horamavu outlet, Bengaluru. Free delivery above {formatPrice(FREE_DELIVERY_FROM)}.
          </div>
        </div>
      </div>

      {product.winterNote && (
        <div className="notice"><strong>Good to know:</strong> {product.winterNote}</div>
      )}

      {/* Education tabs */}
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.key} className="tab" role="tab" aria-selected={t.key === tab} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="panel" role="tabpanel">{renderTab()}</div>

      {/* Comparison table: every form and size side by side */}
      <h2 className="table-title">Compare all options</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr><th>Form</th><th>Size</th><th>Price</th><th>Price per 100</th><th>Best for</th></tr>
          </thead>
          <tbody>
            {product.variants.map((v) => {
              const f = findForm(product, v.formId);
              return (
                <tr key={v.id} className={v.id === variantId ? "selected" : ""}>
                  <td>{f.label}</td>
                  <td>{sizeLabel(v)}</td>
                  <td>{formatPrice(v.price)}</td>
                  <td>{formatPrice(pricePer100(v))} per 100 {v.unit}</td>
                  <td>{f.bestFor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
