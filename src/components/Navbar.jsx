import { useState } from "react";
import Button from "./Button";
import { useShop } from "../store/UseShop";
import { HeartIcon, BagIcon, ReceiptIcon, QrIcon } from "./icons";
import "./Navbar.css";
import logo from "../assets/hb_logo.png";
const DEFAULT_LINKS = [
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Location", href: "#location" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

function Count({ n }) {
  if (!n) return null;
  return <span className="navbar__count">{n}</span>;
}

export default function Navbar({
  // logo = "Hello Bubbles",
  links = DEFAULT_LINKS,
  qrHref = "/qr",
}) {
  const [open, setOpen] = useState(false);
  const { favCount, cartCount, ordersCount, openDrawer, orderCart, cart } = useShop();

  const close = () => setOpen(false);
  const goDrawer = (tab) => {
    openDrawer(tab);
    close();
  };
  const orderPickup = () => {
    if (cart.length) orderCart();
    else openDrawer("cart");
    close();
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar__inner">
          <a className="navbar__logo" href="/">
            <img src={logo} alt="Hello Bubbles" className="navbar__logo-img" />
          </a>

          <button
            className="navbar__toggle"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`navbar__nav ${open ? "is-open" : ""}`}>
            <ul className="navbar__links">
              {links.map((l) => (
                <li key={l.label}>
                  <a className="navbar__link" href={l.href} onClick={close}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="navbar__tools">
              <button
                className="navbar__icon"
                aria-label="Favourites"
                onClick={() => goDrawer("favorites")}
              >
                <HeartIcon />
                <Count n={favCount} />
              </button>

              <button
                className="navbar__icon"
                aria-label="Cart"
                onClick={() => goDrawer("cart")}
              >
                <BagIcon />
                <Count n={cartCount} />
              </button>

              <button
                className="navbar__icon"
                aria-label="Orders"
                onClick={() => goDrawer("orders")}
              >
                <ReceiptIcon />
                <Count n={ordersCount} />
              </button>

              <a
                className="navbar__qr"
                href={qrHref}
                aria-label="Open QR page"
                title="QR page"
                onClick={close}
              >
                <QrIcon />
                <span className="navbar__qr-label">Scan QR</span>
              </a>

              <Button
                variant="solid"
                size="sm"
                className="navbar__order"
                onClick={orderPickup}
              >
                Order Pickup
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
