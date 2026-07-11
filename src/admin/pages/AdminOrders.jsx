import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../lib/api";
import { supabase } from "../../lib/supabase";
import "../admin.css";

const STATUSES = ["new", "preparing", "done", "cancelled"];
const money = (n) => `$${(Number(n) || 0).toFixed(2)}`;
const when = (iso) => {
  try { return new Date(iso).toLocaleString(); } catch { return ""; }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await getOrders();
    if (!error) setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // live updates when a new order comes in
    const channel = supabase
      .channel("orders-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const setStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
  };

  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <h1 className="admin-h1">Orders</h1>
        <button className="admin-btn admin-btn--ghost" onClick={load}>Refresh</button>
      </div>

      {loading ? (
        <p className="admin-muted">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="admin-muted">No orders yet.</p>
      ) : (
        <div className="admin-orders">
          {orders.map((o) => (
            <div className={`admin-order admin-order--${o.status}`} key={o.id}>
              <div className="admin-order__head">
                <strong>#{o.order_no || o.id.slice(0, 6)}</strong>
                <span className="admin-muted">{when(o.created_at)}</span>
              </div>

              <div className="admin-order__cust">
                {o.customer_name} · {o.phone}
              </div>

              <ul className="admin-order__items">
                {(o.items || []).map((it, i) => (
                  <li key={i}>{it.name} × {it.qty}</li>
                ))}
              </ul>

              <div className="admin-order__foot">
                <strong>{money(o.total)}</strong>
                <select
                  className="admin-select"
                  value={o.status}
                  onChange={(e) => setStatus(o.id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
