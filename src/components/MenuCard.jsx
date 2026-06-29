import "./MenuCard.css";

/**
 * A single menu item card: image, name, price.
 * `price` accepts a number (formatted as $0.00) or a preformatted string.
 */
export default function MenuCard({ name, price, image, imageAlt = "" }) {
  const priceLabel =
    typeof price === "number" ? `$${price.toFixed(2)}` : price;

  return (
    <article className="menu-card">
      <div className="menu-card__media">
        {image ? (
          <img src={image} alt={imageAlt || name} loading="lazy" />
        ) : (
          <span className="menu-card__ph">No image</span>
        )}
      </div>

      <div className="menu-card__row">
        <h3 className="menu-card__name">{name}</h3>
        {priceLabel != null && (
          <span className="menu-card__price">{priceLabel}</span>
        )}
      </div>
    </article>
  );
}
