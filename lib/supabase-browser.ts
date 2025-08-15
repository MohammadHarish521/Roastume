"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Client-side Supabase instance for realtime subscriptions and lightweight queries
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  return createClient<Database>(url, anon);
}
