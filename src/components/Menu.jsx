import MenuCard from "./MenuCard";
import { useShop } from "../store/UseShop";
import { BagIcon } from "./icons";
import "./Menu.css";

/* Dummy data — swap for your backend API response later. */
const DEFAULT_ITEMS = [
  { id: 1, name: "Crispy Calamari",      price: 12.99, image: "https://picsum.photos/seed/calamari/600/450" },
  { id: 2, name: "Classic Caesar Salad", price: 11.99, image: "https://picsum.photos/seed/caesar/600/450" },
  { id: 3, name: "Grilled Salmon",       price: 24.99, image: "https://picsum.photos/seed/salmon/600/450" },
  { id: 4, name: "Tiramisu",             price: 10.99, image: "https://picsum.photos/seed/tiramisu/600/450" },
  { id: 5, name: "Crème Brûlée",         price: 8.99,  image: "https://picsum.photos/seed/cremebrulee/600/450" },
  { id: 6, name: "Grilled Asparagus",    price: 7.99,  image: "https://picsum.photos/seed/asparagus/600/450" },
];

export default function Menu({
  title = "Our Menu",
  subtitle = "Explore a curated selection of delicious dishes crafted with the freshest ingredients to satisfy every palate.",
  viewAllLabel = "View All",
  viewAllHref = "#menu",
  items = DEFAULT_ITEMS,
  id = "menu",
}) {
  const {
    isFavorite, toggleFavorite,
    inCart, addToCart,
    orderItems, cartCount, openDrawer,
  } = useShop();

  return (
    <section className="menu" id={id}>
      <div className="container">
        <div className="menu__head">
          <div className="menu__heading">
            <h2 className="menu__title">{title}</h2>
            {subtitle && <p className="menu__subtitle">{subtitle}</p>}
          </div>

          <div className="menu__head-actions">
            {cartCount > 0 && (
              <button type="button" className="menu__cart" onClick={() => openDrawer("cart")}>
                <BagIcon size={16} />
                <span>{cartCount}</span>
              </button>
            )}
            {viewAllLabel && (
              <a className="menu__viewall" href={viewAllHref}>
                {viewAllLabel}
              </a>
            )}
          </div>
        </div>

        <div className="menu__grid">
          {items.map((item, i) => (
            <MenuCard
              key={item.id ?? i}
              {...item}
              bookmarked={isFavorite(item.id)}
              inCart={inCart(item.id)}
              onToggleBookmark={() => toggleFavorite(item)}
              onAddToCart={() => addToCart(item)}
              onOrder={() => orderItems([item])}
            />
          ))}
        </div>
      </div>
    </section>
  );
}