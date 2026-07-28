import { useState } from "react";
import Button from "./Button";
import { useShop } from "../store/useShop";
import { BellIcon, HeartIcon, BagIcon, ReceiptIcon, QrIcon } from "./icons";
import "./Navbar.css";
import logo from "../assets/hb_logo.png";
const DEFAULT_LINKS = [
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },

  // { label: "Location", href: "#location" },
  { label: "Social", href: "#instagram" },
  { label: "Contact", href: "#location" },
];

function Count({ n }) {
  if (!n) return null;
  return <span className="navbar__count">{n}</span>;
}

export default function Navbar({
  // logo = "Hello Bubbles",
  links = DEFAULT_LINKS,
  qrHref = "/qr",
}) {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const {
    favCount,
    cartCount,
    ordersCount,
    openDrawer,
    orderCart,
    cart,
    orderNotification,
    notificationPermission,
    enablePushNotifications,
    dismissOrderNotification,
  } = useShop();

  const close = () => setOpen(false);
  const goDrawer = (tab) => {
    openDrawer(tab);
    close();
  };
  const orderPickup = () => {
    if (cart.length) orderCart();
    else openDrawer("cart");
    close();
  };
  const openNotifications = async () => {
    if (notificationPermission === "default") {
      await enablePushNotifications();
    }
    setNotificationsOpen((current) => !current);
  };
  const notificationStatus =
    orderNotification?.status === "done"
      ? "Ready for pickup"
      : orderNotification?.status
        ? orderNotification.status[0].toUpperCase() + orderNotification.status.slice(1)
        : "";

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar__inner">
          <a className="navbar__logo" href="/">
            <img src={logo} alt="Hello Bubbles" className="navbar__logo-img" />
          </a>

          <button
            className="navbar__toggle"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`navbar__nav ${open ? "is-open" : ""}`}>
            <ul className="navbar__links">
              {links.map((l) => (
                <li key={l.label}>
                  <a className="navbar__link" href={l.href} onClick={close}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="navbar__tools">
              <button
                className="navbar__icon"
                aria-label="Favourites"
                onClick={() => goDrawer("favorites")}
              >
                <HeartIcon />
                <Count n={favCount} />
              </button>

              <button
                className="navbar__icon"
                aria-label="Cart"
                onClick={() => goDrawer("cart")}
              >
                <BagIcon />
                <Count n={cartCount} />
              </button>

              <button
                className="navbar__icon"
                aria-label="Orders"
                onClick={() => goDrawer("orders")}
              >
                <ReceiptIcon />
                <Count n={ordersCount} />
              </button>

              <div className="navbar__notification-wrap">
                <button
                  className={`navbar__icon navbar__notification ${
                    orderNotification ? "is-active" : ""
                  }`}
                  aria-label={
                    notificationPermission === "default"
                      ? "Enable push notifications"
                      : "Order notifications"
                  }
                  aria-expanded={notificationsOpen}
                  title={
                    notificationPermission === "default"
                      ? "Enable push notifications"
                      : notificationPermission === "denied"
                        ? "Push notifications are blocked in browser settings"
                        : "Order notifications"
                  }
                  onClick={openNotifications}
                >
                  <BellIcon />
                  <Count n={orderNotification ? 1 : 0} />
                </button>

                {notificationsOpen && (
                  <div className="navbar__notification-panel">
                    <div className="navbar__notification-head">
                      <strong>Notifications</strong>
                      <button
                        type="button"
                        aria-label="Close notifications"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        ×
                      </button>
                    </div>
                    {orderNotification ? (
                      <div className="navbar__notification-detail">
                        <span>Order update</span>
                        <strong>
                          #{orderNotification.orderNo || "Order"}
                        </strong>
                        <p>Your order is {notificationStatus}.</p>
                        {!!orderNotification.items?.length && (
                          <ul className="navbar__notification-items">
                            {orderNotification.items.map((item, index) => (
                              <li key={`${item.id || item.name}-${index}`}>
                                <span>{item.name}</span>
                                <strong>×{item.qty}</strong>
                              </li>
                            ))}
                          </ul>
                        )}
                        {orderNotification.total != null && (
                          <div className="navbar__notification-total">
                            <span>Total</span>
                            <strong>
                              £{Number(orderNotification.total).toFixed(2)}
                            </strong>
                          </div>
                        )}
                        <div className="navbar__notification-actions">
                          <button
                            type="button"
                            onClick={() => {
                              openDrawer("orders");
                              setNotificationsOpen(false);
                              close();
                            }}
                          >
                            View order
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              dismissOrderNotification();
                              setNotificationsOpen(false);
                            }}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="navbar__notification-empty">
                        No new order updates.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <a
                className="navbar__qr"
                href={qrHref}
                aria-label="Open QR page"
                title="QR page"
                onClick={close}
              >
                <QrIcon />
                <span className="navbar__qr-label">Scan QR</span>
              </a>

              <Button
                variant="solid"
                size="sm"
                className="navbar__order"
                onClick={orderPickup}
              >
                Order Pickup
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
