import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Helpful during setup — check your .env file
  console.warn("Supabase env vars missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env");
}

export const supabase = createClient(url, anonKey);
