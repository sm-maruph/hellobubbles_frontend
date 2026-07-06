import MenuCard from "./MenuCard";
import { useShop } from "../store/UseShop";
import { BagIcon } from "./icons";
import "./Menu.css";

/* Dummy data — swap for your backend API response later. */
const DEFAULT_ITEMS = [
  { id: 1, name: "Crispy Calamari",      price: 12.99, image: "https://sealandqualityfoods.com/cdn/shop/articles/20230614185559-sealand-breaded-calamari-with-homemade-sauces_a2938c71-f0b4-4fc9-8f1d-b9600b4fa9d8-4453184.jpg?v=1751333104&width=1600" },
  { id: 2, name: "Classic Caesar Salad", price: 11.99, image: "https://assets.bonappetit.com/photos/624215f8a76f02a99b29518f/1:1/w_2800,h_2800,c_limit/0328-ceasar-salad-lede.jpg" },
  { id: 3, name: "Grilled Salmon",       price: 24.99, image: "https://www.cookingclassy.com/wp-content/uploads/2018/05/grilled-salmon-3.jpg" },
  { id: 4, name: "Tiramisu",             price: 10.99, image: "https://thescranline.com/wp-content/uploads/2025/12/TIRAMISU-25-S-01.jpg" },
  { id: 5, name: "Crème Brûlée",         price: 8.99,  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxbBST_mpR1QWyAi_mYBlq1SLhzPxzazHBNuULa8Pkb8x_o4fBjsTk1f46&s=10" },
  { id: 6, name: "Grilled Asparagus",    price: 7.99,  image: "https://www.simplyrecipes.com/thmb/nw6mLCW2JFWbVV54E7iqHDLJMqo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Grilled-Asparagus-LEAD-ef819b5eef8b449eabaa739ee540203c.jpg" },
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