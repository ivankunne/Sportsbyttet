import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const pid = req.nextUrl.searchParams.get("pid");
  if (!pid) {
    return NextResponse.json({ error: "Missing pid" }, { status: 400 });
  }

  const domain = process.env.CRIIPTO_DOMAIN;
  const clientId = process.env.CRIIPTO_CLIENT_ID;
  if (!domain || !clientId) {
    return NextResponse.json({ error: "BankID not configured" }, { status: 500 });
  }

  const state = randomBytes(16).toString("hex");
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/bankid/callback`;

  const cookieStore = await cookies();
  cookieStore.set("bankid_state", JSON.stringify({ state, pid }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid",
    acr_values: "urn:grn:authn:no:bankid",
    state,
  });

  return NextResponse.redirect(`https://${domain}/oauth2/authorize?${params}`);
}
