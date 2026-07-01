import { createContext, useContext, useEffect, useState } from "react";

/* Persistent store for favorites, cart and orders.
   Backed by localStorage so it survives refresh. */

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

// safe fallback so components don't crash if used outside the provider
const FALLBACK = {
  favorites: [],
  cart: [],
  orders: [],
  isFavorite: () => false,
  toggleFavorite: () => {},
  inCart: () => false,
  addToCart: () => {},
  setQty: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartCount: 0,
  favCount: 0,
  ordersCount: 0,
  draft: null,
  orderItems: () => {},
  orderCart: () => {},
  closeOrder: () => {},
  placeOrder: () => {},
  drawer: null,
  openDrawer: () => {},
  closeDrawer: () => {},
  restaurant: {},
};

export function ShopProvider({ children, restaurant = {} }) {
  const initial = load();
  const [favorites, setFavorites] = useState(initial.favorites || []);
  const [cart, setCart] = useState(initial.cart || []);
  const [orders, setOrders] = useState(initial.orders || []);

  const [draft, setDraft] = useState(null);   // order modal: { items, fromCart } | null
  const [drawer, setDrawer] = useState(null);  // "favorites" | "cart" | "orders" | null

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ favorites, cart, orders }));
    } catch {
      /* storage unavailable — ignore */
    }
  }, [favorites, cart, orders]);

  /* favorites */
  const isFavorite = (id) => favorites.some((f) => f.id === id);
  const toggleFavorite = (item) =>
    setFavorites((f) =>
      isFavorite(item.id) ? f.filter((x) => x.id !== item.id) : [...f, strip(item)]
    );

  /* cart */
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

  /* order modal */
  const orderItems = (items) =>
    setDraft({ items: items.map((i) => ({ ...i, qty: i.qty ?? 1 })), fromCart: false });
  const orderCart = () => cart.length && setDraft({ items: cart, fromCart: true });
  const closeOrder = () => setDraft(null);
  const placeOrder = (order) => {
    setOrders((o) => [{ ...order, date: new Date().toISOString() }, ...o]);
    if (draft?.fromCart) clearCart();
  };

  /* drawer */
  const openDrawer = (tab = "cart") => setDrawer(tab);
  const closeDrawer = () => setDrawer(null);

  const value = {
    favorites, cart, orders,
    isFavorite, toggleFavorite,
    inCart, addToCart, setQty, removeFromCart, clearCart,
    cartCount, favCount, ordersCount,
    draft, orderItems, orderCart, closeOrder, placeOrder,
    drawer, openDrawer, closeDrawer,
    restaurant,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext) || FALLBACK;
