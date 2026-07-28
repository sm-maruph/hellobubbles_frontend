import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createOrder, getOrdersByIds } from "../lib/api";
import { supabase } from "../lib/supabase";
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
  orderNotification: null,
  dismissOrderNotification: () => {},
  notificationPermission: "unsupported",
  enablePushNotifications: async () => "unsupported",
};

export function ShopProvider({ children, restaurant = {} }) {
  const initial = load();

  const [favorites, setFavorites] = useState(initial.favorites || []);
  const [cart, setCart] = useState(initial.cart || []);
  const [orders, setOrders] = useState(initial.orders || []);
  const ordersRef = useRef(initial.orders || []);
  const [orderNotification, setOrderNotification] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(() =>
    typeof Notification === "undefined" ? "unsupported" : Notification.permission
  );

  // Order modal
  const [draft, setDraft] = useState(null);

  // Drawer ("favorites" | "cart" | "orders" | null)
  const [drawer, setDrawer] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    ordersRef.current = orders;
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

  // Keep this customer's saved orders in sync. Realtime is immediate when the
  // project permits it; polling is a reliable fallback for restrictive RLS setups.
  useEffect(() => {
    const showStatusUpdate = (updatedOrder) => {
      const currentOrder = ordersRef.current.find(
        (order) => order.id === updatedOrder.id
      );
      if (!currentOrder || currentOrder.status === updatedOrder.status) return;

      const nextOrders = ordersRef.current.map((order) =>
        order.id === updatedOrder.id
          ? { ...order, status: updatedOrder.status }
          : order
      );
      ordersRef.current = nextOrders;
      setOrders(nextOrders);

      const notification = {
        id: updatedOrder.id,
        orderNo: updatedOrder.order_no || currentOrder.orderNo,
        status: updatedOrder.status,
        items: updatedOrder.items || currentOrder.items || [],
        total: updatedOrder.total ?? currentOrder.total,
      };
      setOrderNotification(notification);

      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        const statusLabel =
          updatedOrder.status === "done"
            ? "ready for pickup"
            : updatedOrder.status;
        const itemSummary = notification.items
          .map((item) => `${item.name} ×${item.qty}`)
          .join(", ");
        const totalLabel =
          notification.total == null
            ? ""
            : ` Total: £${Number(notification.total).toFixed(2)}.`;
        new Notification("Hello Bubbles order update", {
          body: `Order #${notification.orderNo || "Order"} is ${statusLabel}. ${itemSummary}.${totalLabel}`,
          icon: "/favicon.ico",
          tag: `order-${updatedOrder.id}`,
          requireInteraction: true,
        });
      }
    };

    const pollStatuses = async () => {
      const ids = ordersRef.current.map((order) => order.id).filter(Boolean);
      if (!ids.length) return;
      const { data, error } = await getOrdersByIds(ids);
      if (error || !data) return;
      data.forEach(showStatusUpdate);
    };

    const channel = supabase
      .channel(`customer-orders-${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        ({ new: updatedOrder }) => showStatusUpdate(updatedOrder)
      )
      .subscribe();

    const intervalId = window.setInterval(pollStatuses, 5000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") pollStatuses();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    pollStatuses();

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, []);

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

  /* =========================
     Drawer
  ========================= */

  const openDrawer = (tab = "cart") => setDrawer(tab);

  const closeDrawer = () => setDrawer(null);
  const dismissOrderNotification = () => setOrderNotification(null);
  const enablePushNotifications = async () => {
    if (typeof Notification === "undefined") return "unsupported";
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    return permission;
  };

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
    orderNotification,
    dismissOrderNotification,
    notificationPermission,
    enablePushNotifications,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext) || FALLBACK;
