import Button from "./Button";
import "./Hero.css";
import heroImg from "../assets/fuscka.jpg";
import heroLogo from "../assets/Hello_Bubbles_Logo.png";   // add at top of Hero.jsx

export default function Hero({
  title = "Hello Bubbles — The Food Artisan",
  subtitle = "Indulge in our handcrafted dishes, where flavors meet love. Join us for an unforgettable culinary journey!",
  ctaLabel = "Make a Order",
  ctaHref = "#menu",
  image,
  imageAlt = "Signature dish at Hello Bubbles",
  id = "home",
}) {
  const src = image || heroImg; // empty string / undefined → use the bundled image

  return (
    <section className="hero" id={id}>
      <div className="container">
        <div className="hero__head">
          <img className="hero__logo" src={heroLogo} alt={title} />          <p className="hero__subtitle">{subtitle}</p>
          <Button as="a" href={ctaHref} variant="outline">
            {ctaLabel}
          </Button>
        </div>

        <figure className="hero__media">
          <img src={src} alt={imageAlt} />
        </figure>
      </div>
    </section>
  );
}
