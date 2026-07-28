import { useCallback, useEffect, useRef, useState } from "react";
import { deleteOrder, getOrders, updateOrderStatus } from "../../lib/api";
import { supabase } from "../../lib/supabase";
import "../admin.css";

const STATUSES = ["new", "preparing", "done", "cancelled"];
const PAGE_SIZE = 9;
const money = (n) => `£${(Number(n) || 0).toFixed(2)}`;
const when = (iso) => {
  try { return new Date(iso).toLocaleString(); } catch { return ""; }
};
const localDateValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const dateRange = (value) => {
  if (!value) return {};
  const from = new Date(`${value}T00:00:00`);
  const to = new Date(from);
  to.setDate(to.getDate() + 1);
  return { createdFrom: from.toISOString(), createdTo: to.toISOString() };
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState(localDateValue);
  const [status, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const hasLoaded = useRef(false);

  const load = useCallback(async () => {
    if (!hasLoaded.current) setLoading(true);
    setError("");
    const { data, error: loadError, count: total } = await getOrders({
      page,
      pageSize: PAGE_SIZE,
      status,
      ...dateRange(date),
    });
    if (loadError) {
      setError(loadError.message || "Could not load orders.");
    } else {
      setOrders(data || []);
      setCount(total || 0);
    }
    hasLoaded.current = true;
    setLoading(false);
  }, [date, page, status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(load, 0);
    return () => window.clearTimeout(timeoutId);
  }, [load, refreshKey]);

  useEffect(() => {
    const refresh = () => setRefreshKey((key) => key + 1);
    const channel = supabase
      .channel("orders-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        setPage(1);
        refresh();
      })
      .subscribe();

    // Fallback when Realtime is unavailable or blocked by project settings.
    const intervalId = window.setInterval(refresh, 5000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, []);

  const changeStatus = async (id, nextStatus) => {
    setError("");
    const { error: updateError } = await updateOrderStatus(id, nextStatus);
    if (updateError) {
      setError(updateError.message || "Could not update the order.");
      return;
    }
    setRefreshKey((key) => key + 1);
  };

  const removeOrder = async (order) => {
    setDeletingId(order.id);
    setError("");
    const { error: deleteError } = await deleteOrder(order.id);
    setDeletingId(null);
    if (deleteError) {
      setError(deleteError.message || "Could not delete the order.");
      return;
    }

    if (orders.length === 1 && page > 1) {
      setPage((current) => current - 1);
    } else {
      setRefreshKey((key) => key + 1);
    }
  };

  const confirmSelectedAction = async () => {
    if (!confirmAction) return;
    setConfirming(true);
    if (confirmAction.type === "delete") {
      await removeOrder(confirmAction.order);
    } else {
      await changeStatus(confirmAction.order.id, "cancelled");
    }
    setConfirming(false);
    setConfirmAction(null);
  };

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <h1 className="admin-h1">Orders</h1>
        <button
          className="admin-btn admin-btn--ghost"
          onClick={() => setRefreshKey((key) => key + 1)}
        >
          Refresh
        </button>
      </div>

      <div className="admin-order-filters">
        <label className="admin-field">
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <label className="admin-field">
          <span>Status</span>
          <select
            className="admin-select"
            value={status}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <button
          className="admin-btn admin-btn--ghost admin-btn--sm"
          type="button"
          onClick={() => {
            setDate("");
            setStatusFilter("");
            setPage(1);
          }}
        >
          Clear filters
        </button>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="admin-muted">No orders match these filters.</p>
      ) : (
        <>
          <div className="admin-orders">
            {orders.map((o) => (
              <div className={`admin-order admin-order--${o.status}`} key={o.id}>
                <div className="admin-order__head">
                  <strong>#{o.order_no || o.id.slice(0, 6)}</strong>
                  <span className="admin-muted">{when(o.created_at)}</span>
                </div>

                <div className="admin-order__customer">
                  <div>
                    <span>Customer</span>
                    <strong>{o.customer_name || "Not provided"}</strong>
                  </div>
                  <div>
                    <span>Contact</span>
                    {o.phone ? (
                      <a href={`tel:${String(o.phone).replace(/[^\d+]/g, "")}`}>
                        {o.phone}
                      </a>
                    ) : (
                      <strong>Not provided</strong>
                    )}
                  </div>
                </div>

                <ul className="admin-order__items">
                  {(o.items || []).map((it, i) => (
                    <li key={i}>
                      <span>{it.name}</span>
                      <strong>×{it.qty}</strong>
                    </li>
                  ))}
                </ul>

                <div className="admin-order__foot">
                  <span>Total</span>
                  <strong>{money(o.total)}</strong>
                </div>

                <div className="admin-order__statuses" aria-label="Update order status">
                  {STATUSES.map((item) => (
                    <button
                      key={item}
                      className={`admin-order__status ${
                        o.status === item ? "is-active" : ""
                      }`}
                      type="button"
                      aria-pressed={o.status === item}
                      disabled={o.status === item}
                      onClick={() => {
                        if (item === "cancelled") {
                          setConfirmAction({ type: "cancel", order: o });
                        } else {
                          changeStatus(o.id, item);
                        }
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="admin-order__actions">
                  <button
                    className="admin-btn admin-btn--ghost admin-btn--sm admin-order__view"
                    type="button"
                    onClick={() => setSelectedOrder(o)}
                  >
                    View details
                  </button>
                  <button
                    className="admin-btn admin-btn--danger admin-btn--sm admin-order__delete"
                    type="button"
                    disabled={deletingId === o.id}
                    onClick={() => setConfirmAction({ type: "delete", order: o })}
                  >
                    {deletingId === o.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-pagination" aria-label="Order pages">
            <button
              className="admin-btn admin-btn--ghost admin-btn--sm"
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>
            <span className="admin-muted">
              Page {page} of {totalPages} · {count} orders
            </span>
            <button
              className="admin-btn admin-btn--ghost admin-btn--sm"
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {confirmAction && (
        <div
          className="admin-confirm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !confirming) {
              setConfirmAction(null);
            }
          }}
        >
          <div
            className={`admin-confirm__dialog admin-confirm__dialog--${confirmAction.type}`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="order-confirm-title"
            aria-describedby="order-confirm-description"
          >
            <div className="admin-confirm__icon" aria-hidden="true">
              {confirmAction.type === "delete" ? "×" : "!"}
            </div>
            <span className="admin-confirm__eyebrow">
              {confirmAction.type === "delete" ? "Permanent action" : "Status change"}
            </span>
            <h2 id="order-confirm-title">
              {confirmAction.type === "delete" ? "Delete this order?" : "Cancel this order?"}
            </h2>
            <p id="order-confirm-description">
              Order #
              {confirmAction.order.order_no || confirmAction.order.id.slice(0, 6)}
              {confirmAction.type === "delete"
                ? " will be permanently removed and cannot be restored."
                : " will be marked as cancelled. The customer will be notified."}
            </p>
            <div className="admin-confirm__actions">
              <button
                className="admin-btn admin-btn--ghost"
                type="button"
                disabled={confirming}
                onClick={() => setConfirmAction(null)}
              >
                Keep order
              </button>
              <button
                className="admin-btn admin-confirm__submit"
                type="button"
                disabled={confirming}
                onClick={confirmSelectedAction}
              >
                {confirming
                  ? "Please wait…"
                  : confirmAction.type === "delete"
                    ? "Yes, delete"
                    : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div
          className="admin-order-details"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedOrder(null);
          }}
        >
          <div
            className="admin-order-details__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-details-title"
          >
            <div className="admin-order-details__head">
              <div>
                <span>Order details</span>
                <h2 id="order-details-title">
                  #{selectedOrder.order_no || selectedOrder.id.slice(0, 6)}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close order details"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="admin-order-details__meta">
              <div><span>Customer</span><strong>{selectedOrder.customer_name || "Not provided"}</strong></div>
              <div><span>Contact</span><strong>{selectedOrder.phone || "Not provided"}</strong></div>
              <div><span>Date</span><strong>{when(selectedOrder.created_at)}</strong></div>
              <div><span>Status</span><strong className="admin-order-details__status">{selectedOrder.status}</strong></div>
            </div>

            <div className="admin-order-details__table">
              <div className="admin-order-details__row admin-order-details__row--head">
                <span>Item</span>
                <span>Price</span>
                <span>Qty</span>
                <span>Subtotal</span>
              </div>
              {(selectedOrder.items || []).map((item, index) => {
                const unitPrice = Number(item.price) || 0;
                const quantity = Number(item.qty) || 0;
                return (
                  <div className="admin-order-details__row" key={`${item.id || item.name}-${index}`}>
                    <strong>{item.name}</strong>
                    <span>{money(unitPrice)}</span>
                    <span>×{quantity}</span>
                    <strong>{money(unitPrice * quantity)}</strong>
                  </div>
                );
              })}
            </div>

            <div className="admin-order-details__total">
              <span>Order total</span>
              <strong>{money(selectedOrder.total)}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
