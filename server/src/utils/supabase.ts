import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL ?? "";
  const publishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

  if (!url || !publishableKey) {
    throw new Error(
      "Supabase auth is not configured. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return { url, publishableKey };
};

export const getSupabaseServerClient = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const { url, publishableKey } = getSupabaseConfig();

  supabaseClient = createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseClient;
};
