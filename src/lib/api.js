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
export const getOrders = ({
  page = 1,
  pageSize = 9,
  status,
  createdFrom,
  createdTo,
} = {}) => {
  const from = (page - 1) * pageSize;
  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (status) query = query.eq("status", status);
  if (createdFrom) query = query.gte("created_at", createdFrom);
  if (createdTo) query = query.lt("created_at", createdTo);

  return query;
};

export const createOrder = (row) =>
  supabase.from("orders").insert(row).select().single();
export const getOrdersByIds = (ids) =>
  supabase
    .from("orders")
    .select("id,status,order_no,items,total")
    .in("id", ids);

export const updateOrderStatus = (id, status) =>
  supabase.from("orders").update({ status }).eq("id", id);

export const deleteOrder = async (id) => {
  const { data, error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) return { data, error };
  if (!data?.length) {
    return {
      data,
      error: new Error(
        "Order was not deleted. The Supabase orders table is missing an authenticated DELETE policy."
      ),
    };
  }
  return { data, error: null };
};

/* ---------- SETTINGS (single row id = 1) ---------- */
export const getSettings = () =>
  supabase.from("settings").select("*").eq("id", 1).single();

export const updateSettings = (row) =>
  supabase.from("settings").update({ ...row, updated_at: new Date().toISOString() })
    .eq("id", 1).select().single();


    /* ---------- ABOUT IMAGES ---------- */
export const getAboutImages = () =>
  supabase.from("about_images").select("*").order("sort").order("created_at");
export const createAboutImage = (row) =>
  supabase.from("about_images").insert(row).select().single();
export const deleteAboutImage = (id) =>
  supabase.from("about_images").delete().eq("id", id);

/* ---------- REVIEWS ---------- */
export const getReviews = () =>
  supabase.from("reviews").select("*").order("sort").order("created_at");
export const createReview = (row) =>
  supabase.from("reviews").insert(row).select().single();
export const updateReview = (id, row) =>
  supabase.from("reviews").update(row).eq("id", id).select().single();
export const deleteReview = (id) =>
  supabase.from("reviews").delete().eq("id", id);



/* ---------- QR GALLERY ---------- */
export const getQrGallery = () =>
  supabase.from("qr_gallery").select("*").order("sort").order("created_at");
export const createQrGalleryItem = (row) =>
  supabase.from("qr_gallery").insert(row).select().single();
export const updateQrGalleryItem = (id, row) =>
  supabase.from("qr_gallery").update(row).eq("id", id).select().single();
export const deleteQrGalleryItem = (id) =>
  supabase.from("qr_gallery").delete().eq("id", id);


/* ---------- HERO IMAGES (slider) ---------- */
export const getHeroImages = () =>
  supabase.from("hero_images").select("*").order("sort").order("created_at");
export const createHeroImage = (row) =>
  supabase.from("hero_images").insert(row).select().single();
export const deleteHeroImage = (id) =>
  supabase.from("hero_images").delete().eq("id", id);
