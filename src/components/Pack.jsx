// Pack.jsx - draws a product picture (a pouch or a bottle) as SVG,
// so the project needs no image files. The colour comes from the product.
export default function Pack({ product, size = 120 }) {
  const color = product.color;
  const height = size * 1.25;

  if (product.pack === "bottle") {
    return (
      <svg width={size} height={height} viewBox="0 0 120 150" role="img" aria-label={product.name}>
        <rect x="46" y="6" width="28" height="16" rx="3" fill="#17352a" />
        <rect x="50" y="22" width="20" height="16" fill="#e9d9a6" />
        <rect x="26" y="36" width="68" height="108" rx="16" fill={color} opacity="0.9" />
        <rect x="34" y="62" width="52" height="46" rx="5" fill="#ffffff" />
        <rect x="40" y="70" width="40" height="5" rx="2" fill={color} />
        <rect x="40" y="82" width="28" height="4" rx="2" fill="#9aa89f" />
        <rect x="40" y="92" width="34" height="4" rx="2" fill="#9aa89f" />
      </svg>
    );
  }

  // default: a kraft paper pouch with a coloured label
  return (
    <svg width={size} height={height} viewBox="0 0 120 150" role="img" aria-label={product.name}>
      <path d="M22 12 H98 L104 140 H16 Z" fill="#d2a56d" />
      <rect x="22" y="12" width="76" height="10" fill="#b98a52" />
      <rect x="28" y="58" width="64" height="58" rx="5" fill="#ffffff" />
      <rect x="28" y="58" width="64" height="12" rx="5" fill={color} />
      <rect x="36" y="80" width="48" height="5" rx="2" fill={color} />
      <rect x="36" y="91" width="34" height="4" rx="2" fill="#9aa89f" />
      <rect x="36" y="101" width="40" height="4" rx="2" fill="#9aa89f" />
    </svg>
  );
}
