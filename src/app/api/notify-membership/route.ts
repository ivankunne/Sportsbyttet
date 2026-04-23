import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { buildEmail, infoBox, p, FROM, SITE_URL } from "@/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY);
const admin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { type, membership_id } = await req.json() as {
    type: "submitted" | "approved" | "rejected";
    membership_id: number;
  };

  if (!type || !membership_id) {
    return NextResponse.json({ error: "Missing type or membership_id" }, { status: 400 });
  }

  // Load membership + profile + club
  const { data: membership } = await admin
    .from("memberships")
    .select("id, status, message, profile_id, club_id, profiles(id, name, auth_user_id), clubs(id, name, slug)")
    .eq("id", membership_id)
    .single();

  if (!membership) {
    return NextResponse.json({ error: "Membership not found" }, { status: 404 });
  }

  const profile = membership.profiles as { id: number; name: string; auth_user_id: string } | null;
  const club = membership.clubs as { id: number; name: string; slug: string } | null;

  if (!profile?.auth_user_id || !club) {
    return NextResponse.json({ ok: true, skipped: "missing profile or club" });
  }

  const { data: authUser } = await admin.auth.admin.getUserById(profile.auth_user_id);
  const userEmail = authUser.user?.email;
  if (!userEmail) {
    return NextResponse.json({ ok: true, skipped: "no email" });
  }

  const clubUrl = `${SITE_URL}/klubb/${club.slug}`;

  let subject: string;
  let html: string;

  if (type === "submitted") {
    subject = `Søknad om innmelding i ${club.name} mottatt`;
    html = buildEmail({
      heading: "Søknaden din er mottatt!",
      kicker: "Klubbinnmelding",
      body: `
        ${p(`Hei ${profile.name},`)}
        ${p(`Vi har mottatt din forespørsel om å bli medlem av <strong>${club.name}</strong>. Klubbadministratoren vil gjennomgå søknaden din og du vil få en bekreftelse på e-post.`)}
        ${membership.message ? infoBox(membership.message, "Din melding") : ""}
        ${p(`Du kan i mellomtiden utforske annonser og se hva andre klubbmedlemmer selger.`)}
      `,
      cta: { href: clubUrl, label: `Se ${club.name}` },
      footerNote: `Du mottar denne e-posten fordi du søkte om innmelding i ${club.name} på Sportsbytte.`,
    });
  } else if (type === "approved") {
    subject = `Du er nå medlem av ${club.name} 🎉`;
    html = buildEmail({
      heading: `Velkommen til ${club.name}!`,
      kicker: "Søknad godkjent",
      body: `
        ${p(`Hei ${profile.name},`)}
        ${p(`Flott nyhet — din søknad om innmelding i <strong>${club.name}</strong> er godkjent! Du er nå et fullverdig klubbmedlem og har tilgang til alle annonser i klubben.`)}
        ${p(`Logg inn for å se hva klubbmedlemmene dine selger, eller legg ut ditt eget utstyr.`)}
      `,
      cta: { href: clubUrl, label: `Gå til ${club.name}` },
      footerNote: `Du mottar denne e-posten fordi du er nå medlem av ${club.name} på Sportsbytte.`,
    });
  } else {
    subject = `Søknad om innmelding i ${club.name}`;
    html = buildEmail({
      heading: "Søknaden din ble ikke godkjent",
      kicker: "Søknad ikke godkjent",
      body: `
        ${p(`Hei ${profile.name},`)}
        ${p(`Din søknad om innmelding i <strong>${club.name}</strong> ble dessverre ikke godkjent denne gangen. Ta gjerne kontakt med klubben direkte for mer informasjon.`)}
        ${p(`Du kan søke innmelding i andre klubber eller bruke Sportsbytte som uregistrert bruker.`)}
      `,
      cta: { href: `${SITE_URL}/klubber`, label: "Finn en annen klubb" },
      footerNote: `Du mottar denne e-posten fordi du søkte om innmelding i ${club.name} på Sportsbytte.`,
    });
  }

  const { error } = await resend.emails.send({ from: FROM, to: userEmail, subject, html });
  if (error) {
    console.error("notify-membership Resend error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
