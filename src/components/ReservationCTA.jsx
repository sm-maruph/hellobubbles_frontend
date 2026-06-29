import Button from "./Button";
import "./ReservationCTA.css";

/**
 * Full-width image banner with a dark overlay, headline and CTA.
 * Swap `image` for a backend URL later.
 */
export default function ReservationCTA({
  title = "Elevate your dining experience to a higher quality.",
  ctaLabel = "Make a Reservation",
  ctaHref = "#reservations",
  image = "https://picsum.photos/seed/eatery-reserve/1400/600",
  imageAlt = "",
  id = "reservations",
}) {
  return (
    <section className="cta-banner" id={id}>
      <div className="container">
        <div className="cta-banner__inner">
          <img className="cta-banner__bg" src={image} alt={imageAlt} loading="lazy" />

          <div className="cta-banner__content">
            <h2 className="cta-banner__title">{title}</h2>
            <Button as="a" href={ctaHref} variant="solid" className="cta-banner__btn">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
