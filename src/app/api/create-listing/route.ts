import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/lib/database.types";
import { SITE_URL } from "@/lib/email";

// Service role bypasses RLS — required for inserting into listings
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("listings")
    .insert(body)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fire-and-forget seller confirmation — non-blocking
  fetch(`${SITE_URL}/api/notify-listing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "published", listing_id: data.id }),
  }).catch(() => {});

  return NextResponse.json({ id: data.id });
}
