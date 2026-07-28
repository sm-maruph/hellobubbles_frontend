import { useShop } from "../store/useShop";
import "./OrderStatusNotification.css";

const STATUS_LABELS = {
  new: "New",
  preparing: "Preparing",
  done: "Ready for pickup",
  cancelled: "Cancelled",
};

export default function OrderStatusNotification() {
  const {
    orderNotification,
    dismissOrderNotification,
    openDrawer,
  } = useShop();

  if (!orderNotification) return null;

  const label =
    STATUS_LABELS[orderNotification.status] || orderNotification.status;

  return (
    <aside
      className={`order-status-alert order-status-alert--${orderNotification.status}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="order-status-alert__content">
        <span className="order-status-alert__eyebrow">Order update</span>
        <strong>
          #{orderNotification.orderNo || "Order"} is {label}
        </strong>
      </div>
      <div className="order-status-alert__actions">
        <button
          type="button"
          onClick={() => {
            openDrawer("orders");
            dismissOrderNotification();
          }}
        >
          View order
        </button>
        <button
          className="order-status-alert__close"
          type="button"
          aria-label="Close order notification"
          onClick={dismissOrderNotification}
        >
          ×
        </button>
      </div>
    </aside>
  );
}
