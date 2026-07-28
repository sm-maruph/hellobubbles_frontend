import { useEffect, useRef, useState } from "react";
import MenuCard from "./MenuCard";
import { useShop } from "../store/useShop";
import { getMenu, getTopMenuItems } from "../lib/api";
import { BagIcon } from "./icons";
import "./Menu.css";

const DEFAULT_ITEMS = [
  { id: 1, name: "Crispy Calamari", price: 12.99, category: "Starters", image: "https://sealandqualityfoods.com/cdn/shop/articles/20230614185559-sealand-breaded-calamari-with-homemade-sauces_a2938c71-f0b4-4fc9-8f1d-b9600b4fa9d8-4453184.jpg?v=1751333104&width=1600" },
  { id: 2, name: "Classic Caesar Salad", price: 11.99, category: "Salads", image: "https://assets.bonappetit.com/photos/624215f8a76f02a99b29518f/1:1/w_2800,h_2800,c_limit/0328-ceasar-salad-lede.jpg" },
  { id: 3, name: "Grilled Salmon", price: 24.99, category: "Mains", image: "https://www.cookingclassy.com/wp-content/uploads/2018/05/grilled-salmon-3.jpg" },
  { id: 4, name: "Tiramisu", price: 10.99, category: "Desserts", image: "https://thescranline.com/wp-content/uploads/2025/12/TIRAMISU-25-S-01.jpg" },
  { id: 5, name: "Crème Brûlée", price: 8.99, category: "Desserts", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxbBST_mpR1QWyAi_mYBlq1SLhzPxzazHBNuULa8Pkb8x_o4fBjsTk1f46&s=10" },
  { id: 6, name: "Grilled Asparagus", price: 7.99, category: "Sides", image: "https://www.simplyrecipes.com/thmb/nw6mLCW2JFWbVV54E7iqHDLJMqo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Grilled-Asparagus-LEAD-ef819b5eef8b449eabaa739ee540203c.jpg" },
];

const getCategories = (items) => [
  "All",
  ...Array.from(new Set(items.map((item) => item.category).filter(Boolean))),
];

const withMenuOrder = (items) =>
  items.map((item, menuOrder) => ({ ...item, menuOrder }));

function MenuSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value) || options[0];

  return (
    <div
      className="menu__control menu__select"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <span>{label}</span>
      <button
        type="button"
        className={`menu__select-trigger ${open ? "is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected.label}</span>
        <span className="menu__select-chevron" aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="menu__select-options" role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={option.value === value ? "is-selected" : ""}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Menu({
  title = "Our Menu",
  subtitle = "Explore a curated selection of delicious dishes crafted with the freshest ingredients to satisfy every palate.",
  viewAllLabel = "View All",
  viewAllHref = "#menu",
  id = "menu",
}) {
  const menuRef = useRef(null);
  const {
    isFavorite,
    toggleFavorite,
    inCart,
    addToCart,
    orderItems,
    cartCount,
    openDrawer,
  } = useShop();

  const [items, setItems] = useState(() => withMenuOrder(DEFAULT_ITEMS));
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [pageSize, setPageSize] = useState("10");
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [topSellers, setTopSellers] = useState({});

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await getMenu();
      if (!alive) return;
      if (!error && data?.length) {
        const rows = data
          .filter((row) => row.available !== false)
          .map((row, menuOrder) => ({
            id: row.id,
            name: row.name,
            price: Number(row.price),
            category: row.category,
            image: row.image_url,
            description: row.description || row.details || "",
            createdAt: row.created_at,
            orderCount: Number(row.order_count ?? row.sales_count ?? 0),
            popularity: Number(row.popularity ?? row.order_count ?? row.sales_count ?? 0),
            popular: Boolean(row.popular ?? row.is_popular),
            menuOrder,
          }));
        if (rows.length) setItems(rows);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const loadTopSellers = async () => {
      const from = new Date();
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setDate(to.getDate() + 1);
      const { data, error } = await getTopMenuItems(
        from.toISOString(),
        to.toISOString()
      );
        if (!alive || error || !data) return;
        setTopSellers(
          Object.fromEntries(
            data.map((row, index) => [
              String(row.item_id),
              { rank: index + 1, quantity: Number(row.quantity) || 0 },
            ])
          )
        );
    };
    loadTopSellers();
    const intervalId = window.setInterval(loadTopSellers, 30000);

    return () => {
      alive = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const categories = getCategories(items);
  const categoryItems =
    activeCat === "All"
      ? items
      : items.filter((item) => item.category === activeCat);
  const sortedItems = [...categoryItems].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "popular") {
      const aToday = topSellers[String(a.id)];
      const bToday = topSellers[String(b.id)];
      if (aToday || bToday) {
        if (!aToday) return 1;
        if (!bToday) return -1;
        return aToday.rank - bToday.rank;
      }
      return (
        Number(b.popular) - Number(a.popular) ||
        b.popularity - a.popularity ||
        a.menuOrder - b.menuOrder
      );
    }
    return (
      new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime() ||
      b.menuOrder - a.menuOrder
    );
  });

  const perPage =
    pageSize === "all" ? sortedItems.length || 1 : Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / perPage));
  const visible =
    pageSize === "all"
      ? sortedItems
      : sortedItems.slice((page - 1) * perPage, page * perPage);

  const chooseCategory = (category) => {
    setActiveCat(category);
    setPage(1);
  };
  const chooseSort = (value) => {
    setSortBy(value);
    setPage(1);
  };
  const goToPage = (nextPage) => {
    setPage(nextPage);
    window.requestAnimationFrame(() => {
      menuRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section className="menu" id={id} ref={menuRef}>
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
              <a className="menu__viewall" href={viewAllHref}>{viewAllLabel}</a>
            )}
          </div>
        </div>

        <div className="menu__categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`menu__chip ${activeCat === category ? "is-active" : ""}`}
              onClick={() => chooseCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="menu__controls">
          <div className="menu__control-group">
            <MenuSelect
              label="Sort by"
              value={sortBy}
              onChange={chooseSort}
              options={[
                { value: "newest", label: "Newest" },
                { value: "price-low", label: "Price: low to high" },
                { value: "price-high", label: "Price: high to low" },
                { value: "popular", label: "Popular Now" },
              ]}
            />
            <button
              type="button"
              className={`menu__popular ${sortBy === "popular" ? "is-active" : ""}`}
              aria-pressed={sortBy === "popular"}
              onClick={() => chooseSort(sortBy === "popular" ? "newest" : "popular")}
            >
              <span className="menu__popular-flame" aria-hidden="true">🔥</span>
              Popular Now
            </button>
          </div>

          <MenuSelect
            label="Show"
            value={pageSize}
            onChange={(value) => {
              setPageSize(value);
              setPage(1);
            }}
            options={[
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "30", label: "30" },
              { value: "50", label: "50" },
              { value: "all", label: "All" },
            ]}
          />
        </div>

        {loading ? (
          <p className="menu__empty">Loading menu…</p>
        ) : sortedItems.length === 0 ? (
          <p className="menu__empty">No items in this category yet.</p>
        ) : (
          <>
            <div className="menu__grid">
              {visible.map((item, index) => (
                <MenuCard
                  key={item.id ?? index}
                  {...item}
                  bookmarked={isFavorite(item.id)}
                  inCart={inCart(item.id)}
                  topSeller={topSellers[String(item.id)]}
                  onView={() =>
                    setSelectedItem({
                      ...item,
                      todaySales: topSellers[String(item.id)]?.quantity,
                    })
                  }
                  onToggleBookmark={() => toggleFavorite(item)}
                  onAddToCart={() => addToCart(item)}
                  onOrder={() => orderItems([item])}
                />
              ))}
            </div>

            <div className="menu__pagination">
              <span className="menu__page-summary">
                Showing {(page - 1) * perPage + 1}–
                {Math.min(page * perPage, sortedItems.length)} of {sortedItems.length}
              </span>
              {pageSize !== "all" && totalPages > 1 && (
                <div className="menu__page-buttons" aria-label="Menu pages">
                  <button type="button" disabled={page === 1} onClick={() => goToPage(page - 1)}>
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={page === pageNumber ? "is-active" : ""}
                      aria-current={page === pageNumber ? "page" : undefined}
                      onClick={() => goToPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button type="button" disabled={page === totalPages} onClick={() => goToPage(page + 1)}>
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {selectedItem && (
          <div
            className="menu-detail"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedItem(null);
            }}
          >
            <div
              className="menu-detail__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="menu-detail-title"
            >
              <button
                type="button"
                className="menu-detail__close"
                aria-label="Close item details"
                onClick={() => setSelectedItem(null)}
              >
                ×
              </button>
              <div className="menu-detail__media">
                {selectedItem.image ? (
                  <img src={selectedItem.image} alt={selectedItem.name} />
                ) : (
                  <span>No image available</span>
                )}
              </div>
              <div className="menu-detail__content">
                <span className="menu-detail__category">
                  {selectedItem.category || "Menu item"}
                </span>
                <h2 id="menu-detail-title">{selectedItem.name}</h2>
                <strong className="menu-detail__price">
                  £{Number(selectedItem.price).toFixed(2)}
                </strong>
                <p className="menu-detail__description">
                  {selectedItem.description ||
                    "Freshly prepared by Hello Bubbles and available for pickup."}
                </p>
                <div className="menu-detail__orders">
                  <span className="menu-detail__orders-icon" aria-hidden="true">🔥</span>
                  <div>
                    {Number(selectedItem.todaySales ?? selectedItem.orderCount) > 0 ? (
                      <>
                        <strong>
                          A favourite today
                        </strong>
                        <span>
                          Already picked by{" "}
                          {Number(selectedItem.todaySales ?? selectedItem.orderCount)}{" "}
                          {Number(selectedItem.todaySales ?? selectedItem.orderCount) === 1
                            ? "customer"
                            : "customers"}.
                        </span>
                      </>
                    ) : (
                      <>
                        <strong>Be the first to order this today</strong>
                        <span>Freshly prepared and ready for pickup</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="menu-detail__actions">
                  <button
                    type="button"
                    className="menu-detail__order"
                    onClick={() => {
                      setSelectedItem(null);
                      orderItems([selectedItem]);
                    }}
                  >
                    Order Pickup
                  </button>
                  <button
                    type="button"
                    className="menu-detail__cart"
                    onClick={() => addToCart(selectedItem)}
                  >
                    {inCart(selectedItem.id) ? "Add another" : "Add to cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
