import { useState } from "react";
import Button from "./Button";
import "./Navbar.css";

const DEFAULT_LINKS = [
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Reservations", href: "#reservations" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

/* Minimal inline QR glyph — no icon library required */
function QrIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm11-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 0h2v2h-2v-2zm0-4h2v2h-2v-2z" />
    </svg>
  );
}

export default function Navbar({
  logo = "Hello Bubbles",
  links = DEFAULT_LINKS,
  cta = { label: "Book Table", href: "#reservations" },
  qrHref = "/qr",
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar__inner">
          <a className="navbar__logo" href="/">
            {logo}
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
                  <a
                    className="navbar__link"
                    href={l.href}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              className="navbar__qr"
              href={qrHref}
              aria-label="Open QR page"
              title="QR page"
              onClick={() => setOpen(false)}
            >
              <QrIcon />
            </a>

            <Button
              as="a"
              href={cta.href}
              variant="outline"
              size="sm"
              className="navbar__cta"
              onClick={() => setOpen(false)}
            >
              {cta.label}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}