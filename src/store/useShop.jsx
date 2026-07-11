import { createContext, useContext, useEffect, useState } from "react";
import { createOrder, getOrdersByIds } from "../lib/api";
/* Persistent store for favorites, cart and orders.
   Backed by localStorage so it survives refresh.
*/

const KEY = "hb_shop_v1";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

const strip = ({ id, name, price, image }) => ({
  id,
  name,
  price,
  image,
});

const ShopContext = createContext(null);

// Safe fallback so components don't crash if used outside the provider
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
  placeOrder: async () => {},
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

  // Order modal
  const [draft, setDraft] = useState(null);

  // Drawer ("favorites" | "cart" | "orders" | null)
  const [drawer, setDrawer] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          favorites,
          cart,
          orders,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, [favorites, cart, orders]);

  /* =========================
     Favorites
  ========================= */

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  const toggleFavorite = (item) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === item.id)
        ? prev.filter((f) => f.id !== item.id)
        : [...prev, strip(item)]
    );
  };

  /* =========================
     Cart
  ========================= */

  const inCart = (id) => cart.some((item) => item.id === id);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === item.id);

      if (existing) {
        return prev.map((x) =>
          x.id === item.id ? { ...x, qty: x.qty + 1 } : x
        );
      }

      return [...prev, { ...strip(item), qty: 1 }];
    });
  };

  const setQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, qty) }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const favCount = favorites.length;
  const ordersCount = orders.length;

  /* =========================
     Order Modal
  ========================= */

  const orderItems = (items) => {
    setDraft({
      items: items.map((item) => ({
        ...item,
        qty: item.qty ?? 1,
      })),
      fromCart: false,
    });
  };

  const orderCart = () => {
    if (cart.length) {
      setDraft({
        items: cart,
        fromCart: true,
      });
    }
  };

  const closeOrder = () => setDraft(null);

  /* =========================
     Place Order
  ========================= */

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
      id: data?.id,                    // ← keep the Supabase row id
      status: data?.status || "new",   // ← keep initial status
      date: new Date().toISOString(),
    };
    setOrders((prev) => [orderWithMeta, ...prev]);

    if (draft?.fromCart) clearCart();
    // no closeOrder() here — modal shows success
  };



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

  /* =========================
     Drawer
  ========================= */

  const openDrawer = (tab = "cart") => setDrawer(tab);

  const closeDrawer = () => setDrawer(null);

  const value = {
    favorites,
    cart,
    orders,

    isFavorite,
    toggleFavorite,

    inCart,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,

    cartCount,
    favCount,
    ordersCount,

    draft,
    orderItems,
    orderCart,
    closeOrder,
    placeOrder,

    drawer,
    openDrawer,
    closeDrawer,

    restaurant,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext) || FALLBACK;