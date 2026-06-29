import Button from "./Button";
import "./Footer.css";

const DEFAULT_LINKS = [
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Reservations", href: "#reservations" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Footer({
  logo = "Eatery",
  tagline = "Unforgettable Culinary Experiences Await at Heaven Palate",
  reserveLabel = "Reserve Table →",
  reserveHref = "#reservations",

  pagesTitle = "Pages",
  links = DEFAULT_LINKS,

  addressTitle = "Address",
  address = ["782 S Westwood Blvd, Los", "Angeles, CA 90024"],

  hoursTitle = "Hours",
  hours = [
    "Monday – Saturday: 9:00 AM – 12:00 PM",
    "Sunday : 6:00 AM – 12:00 PM",
  ],

  brandName = "Eatery",
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
          {year} <span className="footer__brand-name">{brandName}</span>, rights
          reserved
        </div>
      </div>
    </footer>
  );
}
