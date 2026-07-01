import "./MenuCard.css";

const BookmarkIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="17" height="17"
    fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinejoin="round">
    <path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1z" />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="20" r="1.3" />
    <circle cx="17" cy="20" r="1.3" />
    <path d="M3 4h2l2.2 11.2a1 1 0 0 0 1 .8h8.4a1 1 0 0 0 1-.8L20 8H6" />
  </svg>
);

/**
 * A single menu item card with pickup ordering actions.
 * `price` accepts a number (formatted as $0.00) or a preformatted string.
 */
export default function MenuCard({
  name,
  price,
  image,
  imageAlt = "",
  bookmarked = false,
  inCart = false,
  onToggleBookmark,
  onAddToCart,
  onOrder,
}) {
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

        <button
          type="button"
          className={`menu-card__bookmark ${bookmarked ? "is-active" : ""}`}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          aria-pressed={bookmarked}
          onClick={onToggleBookmark}
        >
          <BookmarkIcon filled={bookmarked} />
        </button>
      </div>

      <div className="menu-card__row">
        <h3 className="menu-card__name">{name}</h3>
        {priceLabel != null && (
          <span className="menu-card__price">{priceLabel}</span>
        )}
      </div>

      <div className="menu-card__actions">
        <button type="button" className="menu-card__order" onClick={onOrder}>
          Order Pickup
        </button>
        <button
          type="button"
          className={`menu-card__cart ${inCart ? "is-active" : ""}`}
          aria-label={inCart ? "In cart — add another" : "Add to cart"}
          onClick={onAddToCart}
        >
          <CartIcon />
        </button>
      </div>
    </article>
  );
}
