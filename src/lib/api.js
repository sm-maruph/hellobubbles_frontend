import { supabase } from "./supabase";

/* ---------- IMAGE UPLOAD (Supabase Storage) ---------- */
export async function uploadImage(file, folder = "menu") {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

/* ---------- MENU ---------- */
export const getMenu = () =>
  supabase.from("menu_items").select("*").order("sort").order("created_at");

export const createMenuItem = (row) =>
  supabase.from("menu_items").insert(row).select().single();

export const updateMenuItem = (id, row) =>
  supabase.from("menu_items").update(row).eq("id", id).select().single();

export const deleteMenuItem = (id) =>
  supabase.from("menu_items").delete().eq("id", id);

/* ---------- ORDERS ---------- */
export const getOrders = () =>
  supabase.from("orders").select("*").order("created_at", { ascending: false });

export const createOrder = (row) =>
  supabase.from("orders").insert(row).select().single();
export const getOrdersByIds = (ids) =>
  supabase.from("orders").select("id,status").in("id", ids);

export const updateOrderStatus = (id, status) =>
  supabase.from("orders").update({ status }).eq("id", id);

/* ---------- SETTINGS (single row id = 1) ---------- */
export const getSettings = () =>
  supabase.from("settings").select("*").eq("id", 1).single();

export const updateSettings = (row) =>
  supabase.from("settings").update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", 1).select().single();
