import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const returnedState = req.nextUrl.searchParams.get("state");

  const cookieStore = await cookies();
  const raw = cookieStore.get("bankid_state")?.value;

  if (!code || !returnedState || !raw) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?tab=profil&bankid=error`);
  }

  let saved: { state: string; pid: string };
  try {
    saved = JSON.parse(raw);
  } catch {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?tab=profil&bankid=error`);
  }

  if (saved.state !== returnedState) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?tab=profil&bankid=error`);
  }

  cookieStore.delete("bankid_state");

  const domain = process.env.CRIIPTO_DOMAIN!;
  const clientId = process.env.CRIIPTO_CLIENT_ID!;
  const clientSecret = process.env.CRIIPTO_CLIENT_SECRET!;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/bankid/callback`;

  const tokenRes = await fetch(`https://${domain}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?tab=profil&bankid=error`);
  }

  const { id_token } = await tokenRes.json();
  if (!id_token) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?tab=profil&bankid=error`);
  }

  // Decode JWT payload (no signature verification needed — token came from Criipto directly)
  let payload: { sub?: string };
  try {
    const payloadB64 = id_token.split(".")[1];
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
  } catch {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?tab=profil&bankid=error`);
  }

  if (!payload.sub) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?tab=profil&bankid=error`);
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ bankid_verified: true })
    .eq("id", Number(saved.pid));

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?tab=profil&bankid=error`);
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?tab=profil&bankid=verified`);
}
