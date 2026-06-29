import MenuCard from "./MenuCard";
import "./Menu.css";

/* Dummy data — swap for your backend API response later.
   Images use Lorem Picsum (reliable, deterministic per seed).
   Want food-themed placeholders instead? Replace each `image` with:
   `https://loremflickr.com/600/450/<keyword>,food`  (e.g. .../salmon,food)
*/
const DEFAULT_ITEMS = [
  { id: 1, name: "Crispy Calamari",     price: 12.99, image: "https://picsum.photos/seed/calamari/600/450" },
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
  return (
    <section className="menu" id={id}>
      <div className="container">
        <div className="menu__head">
          <div className="menu__heading">
            <h2 className="menu__title">{title}</h2>
            {subtitle && <p className="menu__subtitle">{subtitle}</p>}
          </div>

          {viewAllLabel && (
            <a className="menu__viewall" href={viewAllHref}>
              {viewAllLabel}
            </a>
          )}
        </div>

        <div className="menu__grid">
          {items.map((item, i) => (
            <MenuCard key={item.id ?? i} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
