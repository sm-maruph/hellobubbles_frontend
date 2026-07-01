import { useEffect } from "react";
import Button from "./Button";
import { useShop } from "../store/UseShop";
import { HeartIcon, BagIcon, ReceiptIcon, XIcon, TrashIcon } from "./icons";
import "./AccountDrawer.css";

const money = (n) => `$${(Number(n) || 0).toFixed(2)}`;
const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleString([], {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export default function AccountDrawer() {
  const {
    drawer, closeDrawer, openDrawer,
    favorites, toggleFavorite, addToCart,
    cart, setQty, removeFromCart, clearCart, cartCount, orderCart,
    orders, favCount, ordersCount,
  } = useShop();

  const open = drawer !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeDrawer]);

  if (!open) return null;

  const total = cart.reduce((s, x) => s + (Number(x.price) || 0) * x.qty, 0);

  return (
    <div className="drawer" onClick={closeDrawer}>
      <aside
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer__tabs">
          <button
            className={`drawer__tab ${drawer === "favorites" ? "is-active" : ""}`}
            onClick={() => openDrawer("favorites")}
          >
            <HeartIcon size={16} /> Favourites{favCount ? ` (${favCount})` : ""}
          </button>
          <button
            className={`drawer__tab ${drawer === "cart" ? "is-active" : ""}`}
            onClick={() => openDrawer("cart")}
          >
            <BagIcon size={16} /> Cart{cartCount ? ` (${cartCount})` : ""}
          </button>
          <button
            className={`drawer__tab ${drawer === "orders" ? "is-active" : ""}`}
            onClick={() => openDrawer("orders")}
          >
            <ReceiptIcon size={16} /> Orders{ordersCount ? ` (${ordersCount})` : ""}
          </button>

          <button className="drawer__close" aria-label="Close" onClick={closeDrawer}>
            <XIcon />
          </button>
        </div>

        <div className="drawer__body">
          {/* FAVOURITES */}
          {drawer === "favorites" &&
            (favorites.length === 0 ? (
              <p className="drawer__empty">No favourites yet. Tap the heart on a dish.</p>
            ) : (
              favorites.map((it) => (
                <div className="drow" key={it.id}>
                  <img className="drow__img" src={it.image} alt="" />
                  <div className="drow__main">
                    <p className="drow__name">{it.name}</p>
                    <p className="drow__price">{money(it.price)}</p>
                  </div>
                  <div className="drow__side">
                    <button className="drow__btn" onClick={() => addToCart(it)}>
                      Add
                    </button>
                    <button
                      className="drow__icon"
                      aria-label="Remove favourite"
                      onClick={() => toggleFavorite(it)}
                    >
                      <HeartIcon filled size={16} />
                    </button>
                  </div>
                </div>
              ))
            ))}

          {/* CART */}
          {drawer === "cart" &&
            (cart.length === 0 ? (
              <p className="drawer__empty">Your cart is empty.</p>
            ) : (
              <>
                {cart.map((it) => (
                  <div className="drow" key={it.id}>
                    <img className="drow__img" src={it.image} alt="" />
                    <div className="drow__main">
                      <p className="drow__name">{it.name}</p>
                      <div className="drow__qty">
                        <button onClick={() => setQty(it.id, it.qty - 1)} aria-label="Decrease">–</button>
                        <span>{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.qty + 1)} aria-label="Increase">+</button>
                      </div>
                    </div>
                    <div className="drow__side">
                      <span className="drow__price">{money((Number(it.price) || 0) * it.qty)}</span>
                      <button
                        className="drow__icon"
                        aria-label="Remove"
                        onClick={() => removeFromCart(it.id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="drawer__cartfoot">
                  <div className="drawer__total">
                    <span>Total</span>
                    <span>{money(total)}</span>
                  </div>
                  <Button variant="solid" onClick={orderCart} className="drawer__order">
                    Order Pickup
                  </Button>
                  <button className="drawer__clear" onClick={clearCart}>
                    Clear cart
                  </button>
                </div>
              </>
            ))}

          {/* ORDERS */}
          {drawer === "orders" &&
            (orders.length === 0 ? (
              <p className="drawer__empty">No orders yet.</p>
            ) : (
              orders.map((o) => (
                <div className="ocard" key={o.orderNo}>
                  <div className="ocard__head">
                    <strong>#{o.orderNo}</strong>
                    <span>{fmtDate(o.date)}</span>
                  </div>
                  <p className="ocard__items">
                    {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                  </p>
                  <div className="ocard__foot">
                    <span>{o.name} · {o.phone}</span>
                    <strong>{money(o.total)}</strong>
                  </div>
                </div>
              ))
            ))}
        </div>
      </aside>
    </div>
  );
}
