const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function fetchRestaurant(slug) {
  const res = await fetch(`${API_BASE}/api/qr/${slug}`);
  if (!res.ok) throw new Error("Failed to load restaurant");
  return res.json();
}