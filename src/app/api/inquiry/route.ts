import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/lib/database.types";
import { buildEmail, infoBox, p, FROM } from "@/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY);

// Service role bypasses RLS — required for inserting into inquiries
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    listing_id,
    buyer_name,
    buyer_email,
    message,
    listing_title,
    seller_name,
  } = body;

  if (!listing_id || !buyer_name || !buyer_email || !message) {
    return NextResponse.json(
      { error: "Mangler påkrevde felter: listing_id, buyer_name, buyer_email, message" },
      { status: 400 }
    );
  }

  // 1. Save inquiry to database
  const { error: dbError } = await supabase.from("inquiries").insert({
    listing_id,
    buyer_name,
    buyer_email,
    message,
  });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // 2. Send confirmation email to buyer
  const listingUrl = `${req.nextUrl.origin}/annonse/${listing_id}`;

  const html = buildEmail({
    heading: "Henvendelsen din er sendt!",
    kicker: "Melding sendt",
    body: `
      ${p(`Hei ${buyer_name},`)}
      ${p(`Vi har videresendt meldingen din om <strong>${listing_title}</strong>${seller_name ? ` til ${seller_name}` : ""}. Selgeren vil ta kontakt med deg så snart som mulig.`)}
      ${infoBox(message, "Din melding")}
    `,
    cta: { href: listingUrl, label: "Se annonsen" },
    footerNote: "Du mottar denne e-posten fordi du sendte en henvendelse på Sportsbytte.",
  });

  const { error: emailError } = await resend.emails.send({
    from: FROM,
    to: buyer_email,
    subject: `Din henvendelse om "${listing_title}" er sendt`,
    html,
  });

  if (emailError) {
    // DB insert succeeded — log the email error but don't fail the request
    console.error("Resend email error:", emailError.message);
  }

  return NextResponse.json({ ok: true });
}
