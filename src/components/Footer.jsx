import Button from "./Button";
import "./Footer.css";

const DEFAULT_LINKS = [
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Order Now", href: "#menu" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Footer({
  logo = "Hello Bubbles",
  tagline = "Unforgettable Culinary Experiences Await at Hello Bubbles",
  reserveLabel = "Order Now →",
  reserveHref = "#menu",

  pagesTitle = "Pages",
  links = DEFAULT_LINKS,

  addressTitle = "Address",
  address = ["15 Market Way, London, United Kingdom E14 6AH"],

  hoursTitle = "Hours",
  hours = [
    "Everyday: 11:00 AM – 11:00 PM",
  ],

  brandName = "Hello Bubbles",
  year = new Date().getFullYear(),
}) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* brand */}
          <div className="footer__brand">
            <p className="footer__logo">{logo}</p>
            <p className="footer__tagline">{tagline}</p>
            <Button as="a" href={reserveHref} variant="outline" size="sm">
              {reserveLabel}
            </Button>
          </div>

          {/* pages */}
          <nav className="footer__col">
            <h3 className="footer__col-title">{pagesTitle}</h3>
            <ul className="footer__links">
              {links.map((l) => (
                <li key={l.label}>
                  <a className="footer__link" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* address + hours */}
          <div className="footer__col">
            <div className="footer__block">
              <h3 className="footer__col-title">{addressTitle}</h3>
              <p className="footer__lines">
                {address.map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>

            <div className="footer__block">
              <h3 className="footer__col-title">{hoursTitle}</h3>
              <p className="footer__lines">
                {hours.map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          © All rights reserved by <span className="footer__brand-name">{brandName}</span>, {year}.
        </div>
        <div className="footer__bottom">
          Developed by <span className="footer__brand-name">Theatives</span>
        </div>
      </div>
    </footer>
  );
}
