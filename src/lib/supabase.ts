import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

// Cookie-based client — session survives page refreshes and is refreshed by middleware
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
