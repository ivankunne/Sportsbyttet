import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/lib/database.types";

// Service role bypasses RLS — required for inserting into clubs
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const reg = await req.json();

  const slug =
    reg.club_name
      .toLowerCase()
      .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 6);

  const initials = reg.club_name
    .split(/\s+/)
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const { error } = await supabase.from("clubs").insert({
    name: reg.club_name,
    slug,
    initials,
    color: reg.primary_color || "#1a3c2e",
    secondary_color: reg.secondary_color || null,
    description: reg.description || null,
    logo_url: reg.logo_url || null,
    invite_token: crypto.randomUUID(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Bust the ISR cache so the new club shows up immediately
  revalidatePath("/klubber");
  revalidatePath("/");

  return NextResponse.json({ ok: true, slug });
}
