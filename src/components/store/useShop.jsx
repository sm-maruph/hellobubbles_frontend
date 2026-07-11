import { createContext, useContext, useEffect, useState } from "react";
import { createOrder, getOrdersByIds } from "../lib/api";

const KEY = "hb_shop_v1";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

const strip = ({ id, name, price, image }) => ({ id, name, price, image });

const ShopContext = createContext(null);

const FALLBACK = {
  favorites: [], cart: [], orders: [],
  isFavorite: () => false, toggleFavorite: () => {},
  inCart: () => false, addToCart: () => {}, setQty: () => {},
  removeFromCart: () => {}, clearCart: () => {},
  cartCount: 0, favCount: 0, ordersCount: 0,
  draft: null, orderItems: () => {}, orderCart: () => {},
  closeOrder: () => {}, placeOrder: () => {}, refreshOrders: () => {},
  drawer: null, openDrawer: () => {}, closeDrawer: () => {},
  restaurant: {},
};

export function ShopProvider({ children, restaurant = {} }) {
  const initial = load();
  const [favorites, setFavorites] = useState(initial.favorites || []);
  const [cart, setCart] = useState(initial.cart || []);
  const [orders, setOrders] = useState(initial.orders || []);
  const [draft, setDraft] = useState(null);   // { items, fromCart } | null
  const [drawer, setDrawer] = useState(null);  // "favorites" | "cart" | "orders" | null

  // persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ favorites, cart, orders }));
    } catch {
      /* ignore */
    }
  }, [favorites, cart, orders]);

  /* ---------- favorites ---------- */
  const isFavorite = (id) => favorites.some((f) => f.id === id);
  const toggleFavorite = (item) =>
    setFavorites((f) =>
      isFavorite(item.id) ? f.filter((x) => x.id !== item.id) : [...f, strip(item)]
    );

  /* ---------- cart ---------- */
  const inCart = (id) => cart.some((x) => x.id === id);
  const addToCart = (item) =>
    setCart((c) =>
      c.find((x) => x.id === item.id)
        ? c.map((x) => (x.id === item.id ? { ...x, qty: x.qty + 1 } : x))
        : [...c, { ...strip(item), qty: 1 }]
    );
  const setQty = (id, qty) =>
    setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)));
  const removeFromCart = (id) => setCart((c) => c.filter((x) => x.id !== id));
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const favCount = favorites.length;
  const ordersCount = orders.length;

  /* ---------- order modal ---------- */
  const orderItems = (items) =>
    setDraft({ items: items.map((i) => ({ ...i, qty: i.qty ?? 1 })), fromCart: false });
  const orderCart = () => cart.length && setDraft({ items: cart, fromCart: true });
  const closeOrder = () => setDraft(null);

  const placeOrder = async (order) => {
    const { data, error } = await createOrder({
      order_no: order.orderNo,
      customer_name: order.name,
      phone: order.phone,
      items: order.items,
      total: order.total,
    });
    console.log("Insert result:", { data, error });
    if (error) throw error;

    const orderWithMeta = {
      ...order,
      id: data?.id,                     // Supabase row id — needed to track status
      status: data?.status || "new",
      date: new Date().toISOString(),
    };
    setOrders((prev) => [orderWithMeta, ...prev]);

    if (draft?.fromCart) clearCart();
    // no closeOrder() here — modal shows its success screen
  };

  /* ---------- pull latest order status from Supabase ---------- */
  const refreshOrders = async () => {
    const ids = orders.map((o) => o.id).filter(Boolean);
    if (!ids.length) return;
    const { data, error } = await getOrdersByIds(ids);
    if (error || !data) return;
    const statusById = Object.fromEntries(data.map((r) => [r.id, r.status]));
    setOrders((prev) =>
      prev.map((o) => (o.id && statusById[o.id] ? { ...o, status: statusById[o.id] } : o))
    );
  };

  // refresh statuses whenever the Orders drawer is opened
  useEffect(() => {
    if (drawer === "orders") refreshOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawer]);

  /* ---------- drawer ---------- */
  const openDrawer = (tab = "cart") => setDrawer(tab);
  const closeDrawer = () => setDrawer(null);

  const value = {
    favorites, cart, orders,
    isFavorite, toggleFavorite,
    inCart, addToCart, setQty, removeFromCart, clearCart,
    cartCount, favCount, ordersCount,
    draft, orderItems, orderCart, closeOrder, placeOrder, refreshOrders,
    drawer, openDrawer, closeDrawer,
    restaurant,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext) || FALLBACK;