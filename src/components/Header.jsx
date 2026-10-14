// Header.jsx - the top bar with navigation and the cart count.
export default function Header({ view, cartItems, onNavigate }) {
  // A small helper so each link looks the same
  function NavButton({ name, label }) {
    const active = view === name || (name === "shop" && view === "product");
    return (
      <button className={"nav-link" + (active ? " active" : "")} onClick={() => onNavigate(name)}>
        {label}
      </button>
    );
  }

  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <button className="brand" onClick={() => onNavigate("home")}>
          Roots &amp; Trees <span>Product Explorer</span>
        </button>
        <nav aria-label="Main">
          <NavButton name="home" label="Home" />
          <NavButton name="shop" label="Shop" />
          <NavButton name="cart" label={"Cart (" + cartItems + ")"} />
        </nav>
      </div>
    </header>
  );
}
