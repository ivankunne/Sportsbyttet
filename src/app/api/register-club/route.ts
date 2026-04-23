import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { buildEmail, p, sectionLabel, detailTable, detail, FROM, ADMIN_EMAIL } from "@/lib/email";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use service role if available, fall back to anon for local dev
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    clubName, sport, location, memberCount, orgNumber,
    firstName, lastName, email, phone, role,
    logoUrl, primaryColor, secondaryColor, description,
  } = body;

  // Save to Supabase first
  const { error: dbError } = await supabase.from("club_registrations").insert({
    club_name: clubName,
    sport: sport || null,
    location: location || null,
    member_count: memberCount || null,
    org_number: orgNumber || null,
    first_name: firstName,
    last_name: lastName,
    email,
    phone: phone || null,
    role: role || null,
    logo_url: logoUrl || null,
    primary_color: primaryColor || null,
    secondary_color: secondaryColor || null,
    description: description || null,
  });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  const adminUrl = `${req.nextUrl.origin}/admin/registreringer`;

  // Admin notification email
  const adminHtml = buildEmail({
    heading: `Ny klubbregistrering: ${clubName}`,
    kicker: "Ny søknad",
    body: `
      ${sectionLabel("Om klubben")}
      ${detailTable(
        detail("Klubbnavn", clubName) +
        detail("Idrett", sport) +
        detail("Sted", location) +
        detail("Antall medlemmer", memberCount) +
        detail("Org.nummer", orgNumber)
      )}
      ${sectionLabel("Kontaktperson")}
      ${detailTable(
        detail("Navn", `${firstName || ""} ${lastName || ""}`.trim()) +
        detail("E-post", email) +
        detail("Telefon", phone) +
        detail("Rolle", role)
      )}
      ${sectionLabel("Tilpasning")}
      ${detailTable(
        detail("Primærfarge", primaryColor || "—") +
        detail("Sekundærfarge", secondaryColor || "—") +
        detail("Logo", logoUrl ? `<a href="${logoUrl}" style="color:#0d9488;">Se logo</a>` : "—") +
        detail("Beskrivelse", description || "—")
      )}
    `,
    cta: { href: adminUrl, label: "Se søknaden i admin" },
  });

  // Applicant confirmation email
  const applicantHtml = buildEmail({
    heading: "Søknaden din er mottatt!",
    kicker: "Klubbregistrering",
    body: `
      ${p(`Hei ${firstName},`)}
      ${p(`Vi har mottatt søknaden din om å registrere <strong>${clubName}</strong> på Sportsbytte. Vi gjennomgår søknaden og tar kontakt med deg innen kort tid.`)}
      ${p("Har du spørsmål i mellomtiden? Ta kontakt på <a href='mailto:hei@sportsbytte.no' style='color:#0d9488;'>hei@sportsbytte.no</a>.")}
    `,
    footerNote: "Du mottar denne e-posten fordi du registrerte en klubb på Sportsbytte.",
  });

  const [adminResult, applicantResult] = await Promise.all([
    resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject: `Ny klubbregistrering: ${clubName}`, html: adminHtml }),
    resend.emails.send({ from: FROM, to: email, subject: `Søknaden din for ${clubName} er mottatt`, html: applicantHtml }),
  ]);

  if (adminResult.error) {
    return NextResponse.json({ error: adminResult.error.message }, { status: 500 });
  }
  if (applicantResult.error) {
    console.error("Applicant email error:", applicantResult.error);
  }

  return NextResponse.json({ ok: true });
}
