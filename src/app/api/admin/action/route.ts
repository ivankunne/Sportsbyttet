import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/lib/database.types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Resource = "club" | "profile" | "listing" | "registration" | "inquiry";
type Action = "delete" | "update";

const TABLE_MAP: Record<Resource, keyof Database["public"]["Tables"]> = {
  club: "clubs",
  profile: "profiles",
  listing: "listings",
  registration: "club_registrations",
  inquiry: "inquiries",
};

export async function POST(req: NextRequest) {
  let body: { resource: Resource; action: Action; id: number; data?: Record<string, unknown> };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { resource, action, id, data } = body;

  if (!resource || !action || !id) {
    return NextResponse.json({ error: "Mangler resource, action eller id" }, { status: 400 });
  }

  const table = TABLE_MAP[resource];
  if (!table) {
    return NextResponse.json({ error: `Ukjent resource: ${resource}` }, { status: 400 });
  }

  if (action === "delete") {
    // Special handling for club: first nullify profiles.club_id
    if (resource === "club") {
      const { error: profilesErr } = await supabase
        .from("profiles")
        .update({ club_id: null })
        .eq("club_id", id);

      if (profilesErr) {
        return NextResponse.json({ error: profilesErr.message }, { status: 500 });
      }
    }

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate relevant paths after delete
    if (resource === "club") {
      revalidatePath("/klubber");
      revalidatePath("/");
    } else if (resource === "profile") {
      revalidatePath("/");
    } else if (resource === "listing") {
      revalidatePath("/");
      revalidatePath("/kjop");
    }

    return NextResponse.json({ ok: true });
  }

  if (action === "update") {
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Ingen data å oppdatere" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from(table).update(data as any).eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate relevant paths after update
    if (resource === "club") {
      revalidatePath("/klubber");
      revalidatePath("/");
    } else if (resource === "profile") {
      revalidatePath("/");
    } else if (resource === "listing") {
      revalidatePath("/");
      revalidatePath("/kjop");
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: `Ukjent action: ${action}` }, { status: 400 });
}
